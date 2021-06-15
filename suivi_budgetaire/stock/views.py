from django.http import JsonResponse
from .models import Product, Approv, ApprovItem, User 
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from datetime import datetime, timedelta
import bcrypt
#from django.contrib.auth.models import User
# Create your views here.


JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 50000

@csrf_exempt
def listproduits(request):
    #verify token
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    products = Product.objects.all().order_by('name')
    return JsonResponse([product.serializable() for product in products], safe=False)

@csrf_exempt
def addproduit(request):
    if request.method == 'POST':
        req = request.body
        my_json = req.decode('utf8')
        product = json.loads(my_json)
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.create( name=product['name'], quantity=product['quantity'], security=product['security'], warning=product['warning'], type=product["type"], waitingquantity=product['quantity'])
    #return JsonResponse({'message': 'Enregistrement reussi' })
    return JsonResponse({'message': request.protocol }) 

@csrf_exempt
def updateproduit(request):
    if request.method == 'POST':
        req = request.body
        my_json = req.decode('utf8')
        produit = json.loads(my_json)
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.filter(id=produit["id"]).update(name=produit["name"], quantity=produit["quantity"], security=produit["security"], warning=produit["warning"], type=produit["type"])
    return JsonResponse({'message': 'Mise à jour reussi' })


@csrf_exempt
def deleteproduit(request):
    if request.method == 'POST':
        req = request.body
        my_json = req.decode('utf8')
        produit = json.loads(my_json)
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        prod = Product.objects.get(pk=produit['index'])
        prod.delete()
    return JsonResponse({'message': 'Suppression reussi' })


@csrf_exempt
def deleteapprov(request):
    req = request.body
    my_json = req.decode('utf8')
    approv = json.loads(my_json)
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    app = Approv.objects.get(pk=approv['id'])
    app.delete()
    
    return JsonResponse({}, safe=False)


@csrf_exempt
def lockapprov(request):
    req = request.body
    my_json = req.decode('utf8')
    approv = json.loads(my_json)
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    app = Approv.objects.filter(pk=approv['id']).update(state=True)
    return JsonResponse({}, safe=False)


def tokenVerification(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except (jwt.DecodeError, jwt.ExpiredSignatureError):
        return JsonResponse({'message': 'Token is invalid'}, status=400)
    return payload

@csrf_exempt
def addapprov(request):
    req = request.body
    my_json = req.decode('utf8')
    my_json = my_json.replace(",{", ";{")
    my_json = my_json.replace("[", "")
    my_json = my_json.replace("]", "")
    app = my_json.split(";")
    #infoItem help to know if approv content an IT product
    infoItem = False
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    for a in app:
        b = json.loads(a)
        p = Product.objects.get(name=b['product']).type
        if(p=="informatique"):
            infoItem = True
    
    if(infoItem & bool(User.objects.get(id=payload['user_id']).higher) ):
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=0, infoDecision=0, message="")
        print(" jai besoin des deux")
    elif(infoItem & ~bool(User.objects.get(id=payload['user_id']).higher) ):
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=1, infoDecision=0, message="")
        print("jai besoin de informatique")
    elif(~infoItem & bool(User.objects.get(id=payload['user_id']).higher) ):
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=0, infoDecision=1, message="")
        print("jai besoin de mon chef")
    else:
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=1, infoDecision=1, message="")
        print("jai besoin de personne sur terre")
    approv.save()

    for a in app:
        b = json.loads(a)
        approvItem = ApprovItem(product=Product.objects.get(name=b["product"]), quantity=b["quantity"], approv=approv) 
        approvItem.save()

    return JsonResponse({'message': 'Enregistrement reussi' })


@csrf_exempt
def listapprovsitems(request):
    #payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    approvsItem = ApprovItem.objects.all()
    return JsonResponse([app.serializable() for app in approvsItem],  safe=False)


@csrf_exempt
def listapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    approv = Approv.objects.filter(user__id=payload['user_id'] , state= False)
    return JsonResponse([app.serializable() for app in approv],  safe=False)


@csrf_exempt
def listinferiorapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    approv = Approv.objects.filter(user__higher__id=payload['user_id'], state=False)
    return JsonResponse([app.serializable() for app in approv],  safe=False)
       


@csrf_exempt
def modifapprov(request):
    if request.method == 'POST':
        req = request.body
        my_json = req.decode('utf8')
        my_json = my_json.replace(",{", ";{")
        my_json = my_json.replace("[", "")
        my_json = my_json.replace("]", "")
        app = my_json.split(";")
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        id=json.loads(app[0])
        id=id["approv"]
        infoItem = False
        for a in app:
            b = json.loads(a)
            p = Product.objects.get(name=b['product']).type
            if(p=="informatique"):
                infoItem = True
                break
        if(infoItem):
            Approv.objects.filter(id=id).update(infoDecision=0)
        else:
            Approv.objects.filter(id=id).update(infoDecision=1)
        approv = Approv.objects.get(id=id)
        ApprovItem.objects.filter(approv=id).delete()
        for a in app:
            b = json.loads(a)
            ApprovItem.objects.create(product=Product.objects.get(name=b["product"]), quantity=b["quantity"], approv=approv)

    return JsonResponse({'message': 'Enregistrement reussi' })


@csrf_exempt
def decisionapprovs(request):
    if request.method == 'POST':
        req = request.body
        my_json = req.decode('utf8')
        data=json.loads(my_json)
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        if (data['role']=='informatique'):
            Approv.objects.filter(id=data["id"]).update(infoDecision=data["decision"], message=data["message"])
        else:
            Approv.objects.filter(id=data["id"]).update(higherDecision=data["decision"], message=data["message"])
    return JsonResponse({'message': 'Enregistrement reussi' })


@csrf_exempt
def listuser(request):
    users=User.objects.all()
    return JsonResponse([user.serializable() for user in users],  safe=False) 


@csrf_exempt
def signup(request):
    req = request.body
    print(req)
    my_json = req.decode('utf8')
    data = json.loads(my_json)
    passwd = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
    if(data["superieur"]):
        user = User.objects.get(id=data["superieur"])
        #User.objects.create(name=data['name'], email=data["courriel"], password=data["password"], higher=user, role=data["role"])
        User.objects.create(name=data['name'], email=data["courriel"], password=passwd, higher=user, role=data["role"])
    else:
        User.objects.create(name=data['name'], email=data["courriel"], password=passwd, role=data["role"])
        #User.objects.create(name=data['name'], email=data["courriel"], password=data["password"], role=data["role"])
    
    return JsonResponse({'message': 'Inscription reussi' })



@csrf_exempt
def login(request):
    req = request.body
    my_json = req.decode('utf8')
    data = json.loads(my_json)
    #user = User.objects.create_user('john', 'lennon@thebeatles.com', 'johnpassword')

    try:
        user = User.objects.get(email=data['courriel'])
        #print(bcrypt.checkpw(data["password"], b'$2b$05$vVFIq2BVs2JpkuWjjSxxoOdsSTVDDJ.cG1I2xWLspbcCqItSvOOJq'))
        payload = {
        'user_id': user.id,
        'role': user.role,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }
        jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)
        return JsonResponse({'token': jwt_token.decode('utf-8')}, status=200)
       
    except (User.DoesNotExist):
        return JsonResponse({'message': 'Wrong credentials'}, status=400)




@csrf_exempt
def specialapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    if(payload['role']=='rmg'):
        approvs=Approv.objects.filter(higherDecision=1, infoDecision=1)
    elif(payload['role']=='informatique'):
        #informatique ne doit pas voir les approvs n'ayant pas d'approvItem info bien que infoDecision=1
        approvs=Approv.objects.filter(higherDecision=1).exclude(infoDecision=1)
    else:
        approvs=[]
    return JsonResponse([app.serializable() for app in approvs],  safe=False)