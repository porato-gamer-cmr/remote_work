from django.core.mail import send_mail, EmailMultiAlternatives
from django.http import JsonResponse
from .models import Draft, Product, Approv, ApprovItem, User, DraftItem 
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
        product = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.create( name=product['name'], quantity=product['quantity'], security=product['security'], warning=product['warning'], type=product["type"], waitingquantity=product['quantity'])
    return JsonResponse({'message': "well done" }) 

@csrf_exempt
def updateproduit(request):
    if request.method == 'POST':
        produit = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.filter(id=produit["id"]).update(name=produit["name"], quantity=produit["quantity"], security=produit["security"], warning=produit["warning"], type=produit["type"])
    return JsonResponse({'message': 'Mise à jour reussi' })


@csrf_exempt
def deleteproduit(request):
    if request.method == 'POST':
        produit = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        prod = Product.objects.get(pk=produit['index'])
        prod.delete()
    return JsonResponse({'message': 'Suppression reussi' })


@csrf_exempt
def deleteapprov(request):
    approv = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    Approv.objects.filter(pk=approv['id']).delete()
    
    return JsonResponse({}, safe=False)


@csrf_exempt
def deleteDraft(request):
    draft = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    Draft.objects.filter(pk=draft['id']).delete()
    
    return JsonResponse({}, safe=False)


@csrf_exempt
def lockapprov(request):
    approv = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    Approv.objects.filter(pk=approv['id']).update(state=True)
    return JsonResponse({}, safe=False)


def tokenVerification(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except (jwt.DecodeError, jwt.ExpiredSignatureError):
        return {"message": "token expiré"}
    return payload


@csrf_exempt
def addDraft(request):
    data = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    draft = Draft.objects.create(user=User.objects.get(id=payload['user_id']), libelle=data['libelle'])
    for item in data['listproduits']:
        DraftItem.objects.create(product=Product.objects.get(name=item["product"]), quantity=item["quantity"], draft=draft) 
    return JsonResponse({})

@csrf_exempt
def listDraft(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([draft.serializable() for draft in Draft.objects.filter(user__id=payload['user_id'])], safe=False)


@csrf_exempt
def listDraftItem(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([draft.serializable() for draft in DraftItem.objects.all()], safe=False)


@csrf_exempt
def addapprov(request):
    my_json = json.loads((request.body).decode('utf-8'))
    #infoItem help to know if approv content an IT product
    infoItem = False
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    for item in my_json['listproduits']:
        if(Product.objects.get(name=item['product']).type == "informatique"):
            infoItem = True
    
    if(infoItem & bool(User.objects.get(id=payload['user_id']).higher) ):
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=0, infoDecision=0, message="", libelle=my_json['libelle'])
        print(" jai besoin des deux")
    elif(infoItem & ~bool(User.objects.get(id=payload['user_id']).higher) ):
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=1, infoDecision=0, message="", libelle=my_json['libelle'])
        print("jai besoin de informatique")
    elif(~infoItem & bool(User.objects.get(id=payload['user_id']).higher) ):
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=0, infoDecision=1, message="", libelle=my_json['libelle'])
        print("jai besoin de mon chef")
    else:
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=1, infoDecision=1, message="", libelle=my_json['libelle'])
        print("jai besoin de personne sur terre")
    approv.save()

    for item in my_json['listproduits']:
        approvItem = ApprovItem(product=Product.objects.get(name=item["product"]), quantity=item["quantity"], approv=approv) 
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
    approv = Approv.objects.filter(user__id=payload['user_id'], state= False)
    return JsonResponse([app.serializable() for app in approv],  safe=False)


@csrf_exempt
def listinferiorapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    approv = Approv.objects.filter(user__higher__id=payload['user_id'], state=False)
    return JsonResponse([app.serializable() for app in approv],  safe=False)
       


@csrf_exempt
def modifapprov(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        infoItem = False
        for a in data['listproduits']:
            if(Product.objects.get(name=a['product']).type == "informatique"):
                infoItem = True
                break
        if(infoItem):
            Approv.objects.filter(id=data['id']).update(infoDecision=0, libelle=data['libelle'])
        else:
            Approv.objects.filter(id=data['id']).update(infoDecision=1, libelle=data['libelle'])
        approv = Approv.objects.get(id=data['id'])
        ApprovItem.objects.filter(approv=data['id']).delete()
        for a in data['listproduits']:
            ApprovItem.objects.create(product=Product.objects.get(name=a["product"]), quantity=a["quantity"], approv=approv) 

    return JsonResponse({'message': 'Enregistrement reussi' })



@csrf_exempt
def editDraft(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Draft.objects.filter(id=data['id']).update(libelle=data['libelle'])
        draft = Draft.objects.get(id=data['id'])
        DraftItem.objects.filter(draft=data['id']).delete()
        for a in data['listproduits']:
            DraftItem.objects.create(product=Product.objects.get(name=a["product"]), quantity=a["quantity"], draft=draft)

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
    data = json.loads((request.body).decode('utf8'))
    #verify if this user don't exit
    try:
        User.objects.get(email=data['courriel'], name=data['name'])
        return JsonResponse({'message': 'Cette utilisateur existe déjà' })
    except(User.DoesNotExist):
        #passwd = bcrypt.hashpw(data["password"].encode(), bcrypt.gensalt())
        if(data["superieur"]):
            user = User.objects.get(id=data["superieur"])
            #User.objects.create(name=data['name'], email=data["courriel"], password=data["password"], higher=user, role=data["role"])
            User.objects.create(name=data['name'], email=data["courriel"], password=data['password'], higher=user, role=data["role"])
        else:
            User.objects.create(name=data['name'], email=data["courriel"], password=data['password'], role=data["role"])
            #User.objects.create(name=data['name'], email=data["courriel"], password=data["password"], role=data["role"])
    
    return JsonResponse({'message': 'Inscription reussi' })



@csrf_exempt
def login(request):
    data = json.loads((request.body).decode('utf8'))
    try:
        user = User.objects.get(email=data['courriel'], password=data['password'])
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


@csrf_exempt
def changePassword(request):
    email = (request.body).decode('utf-8')
    try:
        if(User.objects.get(email = email)):
            send_mail("Mot de passe oublié", "Bonjour voici votre nouveau mot de passe", 'jerarlmalim@gmail.com' , ["ngaleusteph@gmail.com"], fail_silently = False)
    except(User.DoesNotExist):
        return JsonResponse({"message": "Cette email n'exite pas en base de donnée"})
    
    return JsonResponse({})


@csrf_exempt
def forgetPassword(request):
    email = (request.body).decode('utf-8')
    try:
        user = User.objects.get(email = email)
        if(user):
            payload = {
                'user_id': user.id,
                'email': user.email,
                'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
                }
            jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)

            content = "Une requete de mot de passe a été signalé pour votre compte. Si vous etes à l origine cliquez , sinon ne faites rien"
            subject = "Mot de passe oublié"
            html_content = "<a href='http://172.16.16.195:4200/reset-password/{0}'>here</a>".format(jwt_token.decode('utf-8'))
            msg = EmailMultiAlternatives(subject, content, 'jerarlmalim@gmail.com' , [email])
            msg.attach_alternative(html_content, "text/html")
            msg.send()
            
            return JsonResponse({}, status=200)
    except(User.DoesNotExist):
        return JsonResponse({"message": "Cette email n'exite pas en base de donnée"})
    
    return JsonResponse({})


@csrf_exempt
def resetPassword(request):
    data = (request.body).decode('utf-8')
    data = json.loads(data)
    try:
        user = User.objects.get(email= data['email'])
        if(user):
            User.objects.filter(email= data['email']).update(password=data['password'])

    except(User.DoesNotExist):
        JsonResponse({'message': 'Cette adresse n existe pas'})

    return JsonResponse({})