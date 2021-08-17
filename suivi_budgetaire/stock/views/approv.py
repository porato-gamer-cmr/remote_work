from django.http import JsonResponse
from ..models import Product, Approv, ApprovItem, User 
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from datetime import datetime
from .auth import tokenVerification


@csrf_exempt
def approvStats(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    allApprov = Approv.objects.filter(user__id = payload['user_id']).count()
    successApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=1, infoDecision=1).count()
    rejectApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=2).count() + Approv.objects.filter(user__id = payload['user_id'], infoDecision=2).count()
    cancelApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=3).filter(user__id = payload['user_id'], infoDecision=3).count()
    waitingApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=1, infoDecision=0).count() + Approv.objects.filter(user__id = payload['user_id'], higherDecision=0, infoDecision=1).count() + Approv.objects.filter(user__id = payload['user_id'], higherDecision=0, infoDecision=0).count()
    draft = Approv.objects.filter(user__id = payload['user_id'], higherDecision=-1).count()
    return JsonResponse({"all": allApprov, "success": successApprov, "reject": rejectApprov, "cancel": cancelApprov, "waiting": waitingApprov, "draft":draft})


@csrf_exempt
def lockapprov(request):
    data = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    Approv.objects.filter(pk=data['id']).update(state=True)
    data1 = Approv.objects.get(pk=data['id'])
    #send_mail('Cloture d une demande approv', 'Salut, {0} vient de clore l approv: {1} avec pour motif {2}'.format(data1.user.name, data1.libelle, data['message']), 'jerarlmalim@gmail.com' , [data1.user.higher.email], fail_silently = False)
    return JsonResponse({}, safe=False)



@csrf_exempt
def addapprov(request):
    data = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    if data['type']=='send' and data['nature']=='simple':
        if(bool(User.objects.get(id=payload['user_id']).higher) ):
            approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=0, infoDecision=1, message="", libelle=data['libelle'])
            print('bonjour')
        else:
            approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=1, infoDecision=1, message="", libelle=data['libelle'])
            print("bonjour")
        for item in data['listproduits']:
            ApprovItem.objects.create(product=Product.objects.get(name=item["product"]), quantity=item["quantity"], approv=approv)
    
    elif(data['type']=='send' and data['nature']=="informatique"):
        if(bool(User.objects.get(id=payload['user_id']).higher) ):
            approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=0, infoDecision=0, message="", libelle=data['libelle'])
        else:
            approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), higherDecision=1, infoDecision=0, message="", libelle=data['libelle'])

        for item in data['listproduits']:
            ApprovItem.objects.create(product=Product.objects.get(name=item["product"]), quantity=item["quantity"], approv=approv) 
    else:
        approv = Approv.objects.create(user=User.objects.get(id=payload['user_id']), libelle=data['libelle'], higherDecision=-1, infoDecision=-1, message="")
        for item in data['listproduits']:
            ApprovItem.objects.create(product=Product.objects.get(name=item["product"]), quantity=item["quantity"], approv=approv)

    return JsonResponse({'message': 'Enregistrement reussi' })



@csrf_exempt
def modifapprov(request):
    data = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    if(data['nature']=='approv'):
        infoItem = False
        for a in data['listproduits']:
            if(Product.objects.get(name=a['product']).type == "informatique"):
                infoItem = True
                break

        if(infoItem & bool(User.objects.get(id=payload['user_id']).higher) ):
            Approv.objects.filter(id=data['id']).update(infoDecision=0, libelle=data['libelle'], higherDecision=0, instant=datetime.now())
        elif(infoItem & ~bool(User.objects.get(id=payload['user_id']).higher) ):
            Approv.objects.filter(id=data['id']).update(infoDecision=0, libelle=data['libelle'], higherDecision=1, instant=datetime.now())
        elif(~infoItem & bool(User.objects.get(id=payload['user_id']).higher)):
            Approv.objects.filter(id=data['id']).update(infoDecision=1, libelle=data['libelle'], higherDecision=0, instant=datetime.now())
        elif(~infoItem & ~bool(User.objects.get(id=payload['user_id']).higher)):
            Approv.objects.filter(id=data['id']).update(infoDecision=1, libelle=data['libelle'], higherDecision=1, instant=datetime.now())

        approv = Approv.objects.get(id=data['id'])
        ApprovItem.objects.filter(approv=data['id']).delete()
        for a in data['listproduits']:
            ApprovItem.objects.create(product=Product.objects.get(name=a["product"]), quantity=a["quantity"], approv=approv) 
            print("Well done")
    
    else:
        approv = Approv.objects.get(id=data['id'])
        Approv.objects.filter(id=data['id']).update(libelle=data['libelle'], instant=datetime.now())
        ApprovItem.objects.filter(approv=data['id']).delete()
        for a in data['listproduits']:
            ApprovItem.objects.create(product=Product.objects.get(name=a["product"]), quantity=a["quantity"], approv=approv)
    return JsonResponse({'message': 'Enregistrement reussi' })



@csrf_exempt
def listapprovsitems(request):
    #payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    approvsItem = ApprovItem.objects.all()
    return JsonResponse([app.serializable() for app in approvsItem],  safe=False)


@csrf_exempt
def listapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    appr = Approv.objects.filter(user__id=payload['user_id'], state= False)
    approvs=[]
    for item in appr:
        isFinished = True
        for item1 in ApprovItem.objects.filter(approv=item.pk):
            if(item1.quantity != item1.sendquantity):
                isFinished = False
        if (isFinished == False):
            approvs.append(item)
    return JsonResponse([app.serializable() for app in appr],  safe=False)
    #return JsonResponse([app.serializable() for app in approvs],  safe=False)


@csrf_exempt
def listinferiorapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    approv = Approv.objects.filter(user__higher__id=payload['user_id'], state=False).exclude(higherDecision=-1).exclude(higherDecision=1, infoDecision=1)
    return JsonResponse([app.serializable() for app in approv],  safe=False)
       


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
def specialapprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    if(payload['role']=='rmg'):
        appr = Approv.objects.filter(higherDecision=1, infoDecision=1)
        approvs=[]
        for item in appr:
            isFinished = True
            for item1 in ApprovItem.objects.filter(approv=item.pk):
                if(item1.quantity != item1.sendquantity):
                    isFinished = False
            if (isFinished == False):
                approvs.append(item)

    elif(payload['role']=='informatique'):
        #informatique ne doit pas voir les approvs n'ayant pas d'approvItem info bien que infoDecision=1
        approvs=Approv.objects.filter(higherDecision=1).exclude(infoDecision=1)
    else:
        approvs=[]
    return JsonResponse([app.serializable() for app in approvs],  safe=False)



@csrf_exempt
def deleteapprov(request):
    approv = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    Approv.objects.filter(pk=approv['id']).delete()
    return JsonResponse({}, safe=False)