from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from ..models import BonCommande, BonCommandeItem, Fournisseur, LigneBudget
from .auth import tokenVerification
import json

@csrf_exempt
def addBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    data = json.loads((request.body).decode('utf-8'))
    bonCommande = BonCommande.objects.create(fournisseur=Fournisseur.objects.get(name=data['fournisseur']), numero_piece=1, cgaiDecision=0, dgDecision=0, ligneBudget=LigneBudget.objects.get(name=data['ligne_budget']))
    for item in data['listproduits']:
        BonCommandeItem.objects.create(product=item['product'], unit_price=item['unit_price'], quantity=item['quantity'], bon_commande=bonCommande)
    return JsonResponse({})

@csrf_exempt
def listBonCommande(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse({}, safe=False)


@csrf_exempt
def listBonCommandeItem(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([item.serializable() for item in BonCommandeItem.objects.all()], safe=False)


@csrf_exempt
def addFileToBonCommande(request):
    payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    return JsonResponse({})


@csrf_exempt
def removeFileToBonCommande(request):
    payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    return JsonResponse({})


@csrf_exempt
def editBonCommande(request):
    payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    return JsonResponse({})


@csrf_exempt
def cancelBonCommande(request):
    payload = tokenVerification(request.header['Authorization'].split(' ')[1])
    data = json.loads((request.body).decode('utf-8'))
    BonCommande.objects.filter(id=data['id']).update(state=False)
    return JsonResponse({})
