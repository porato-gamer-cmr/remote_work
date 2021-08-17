from django.core.checks.messages import Error
from django.db.models.expressions import Window
from django.http import JsonResponse, FileResponse, HttpResponse
from django.urls.conf import path
from django.views.decorators.csrf import csrf_exempt
from ..models import BonCommande, BonCommandeItem, Fournisseur, LigneBudget, UploadFile
from .auth import tokenVerification
from django.db.models import F
import json
from PyPDF2 import PdfFileReader

@csrf_exempt
def addBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    data = json.loads((request.body).decode('utf-8'))
    amount_bill=0
    bonCommande = BonCommande.objects.create(fournisseur=Fournisseur.objects.get(name=data['fournisseur']), cgaiDecision=0, dgDecision=0, ligneBudget=LigneBudget.objects.get(name=data['ligne_budget']))
    for item in data['listproduits']:
        amount_bill= amount_bill + (item['unit_price'] * item['quantity'])
        BonCommandeItem.objects.create(product=item['product'], unit_price=item['unit_price'], quantity=item['quantity'], bon_commande=bonCommande)
    amount_bill = amount_bill + ((amount_bill * Fournisseur.objects.get(name=data['fournisseur']).tva) / 100)
    LigneBudget.objects.filter(name=data['ligne_budget']).update(amount=F('amount')-amount_bill)
    return JsonResponse({})

@csrf_exempt
def listBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([item.serializable() for item in BonCommande.objects.filter(state=0)], safe=False)


@csrf_exempt
def listBonCommandeItem(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([item.serializable() for item in BonCommandeItem.objects.all()], safe=False)


@csrf_exempt
def addFileToBonCommande(request):
    payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    print(request.FILES)
    for item in request.FILES:
        print(request.FILES[item])
    return JsonResponse({})


@csrf_exempt
def removeFileToBonCommande(request):
    #payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    id=(request.body).decode('utf-8')
    UploadFile.objects.filter(pk=id).delete()
    return JsonResponse({})


@csrf_exempt
def editBonCommande(request):
    payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    return JsonResponse({})


@csrf_exempt
def cancelBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    id = (request.body).decode('utf-8')
    BonCommande.objects.filter(pk=id).update(state=1)
    return JsonResponse({})


@csrf_exempt
def confirmBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    id = (request.body).decode('utf-8')
    BonCommande.objects.filter(pk=id).update(state=2)

    return JsonResponse({})


@csrf_exempt
def decisionBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    data = json.loads((request.body).decode('utf-8'))
    if(data['role']=='dg'):
        BonCommande.objects.filter(id=data['id']).update(dgDecision=data['decision'])
    else:
        BonCommande.objects.filter(id=data['id']).update(cgaiDecision=data['decision'])

    return JsonResponse({})


@csrf_exempt
def upload(request):
    id = []
    for i in request.FILES:
        a = UploadFile.objects.create(path=request.FILES[i])
        id.append(a.pk)
    return JsonResponse(id, safe=False)

@csrf_exempt
def linkFileToBon(request):
    data = json.loads(request.body.decode('utf-8'))
    UploadFile.objects.filter(pk__in=data['id']).update(bonCommande=BonCommande.objects.get(pk=data['bon_commande']))
    return JsonResponse({})


@csrf_exempt
def allFile(request):
    return JsonResponse([item.serializable() for item in UploadFile.objects.all()], safe=False)


@csrf_exempt
def getFile(request):
    id=(request.body).decode('utf-8')
    item = UploadFile.objects.get(pk=19)
    img = open('media/{0}'.format(item.path), 'rb')
    return JsonResponse({id: img })

