from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators import csrf
from ..models import Fournisseur, LigneBudget, PosteBudget, BonCommande, BonCommandeItem
from django.db.models import F
import json
from django.views.decorators.csrf import csrf_exempt
import jwt
from django.core.mail import send_mail
from .auth import tokenVerification

JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 50000

#create a particular tokenVerification function for Directeur Financier

#Return the sum of all line amount of a poste
def sumAmount(param):
    b = 0
    for item in param:
        b = b + item['amount']
    return b


@csrf_exempt
def newPoste(request):
    req = request.body
    my_json = req.decode('utf8').replace("'", '"')
    my_json = json.loads(my_json)
    poste = PosteBudget.objects.create(name = my_json['name'], type = my_json['type'], year = my_json['year'])
    for item in my_json['ligne']:
        LigneBudget.objects.create(name = item['name'], amount = item['amount'], posteBudget = poste)
    return JsonResponse({})


@csrf_exempt
def editPoste(request):
    req = request.body
    my_json = req.decode('utf8').replace("'", '"')
    my_json = json.loads(my_json)
    print(my_json)
    poste = PosteBudget.objects.get(pk = my_json['id'])
    LigneBudget.objects.filter(posteBudget=my_json['id']).delete()
    for item in my_json['ligne']:
        LigneBudget.objects.create(name = item['name'], amount = item['amount'], posteBudget = poste)
    return JsonResponse({})


@csrf_exempt
def listePosteFonctionnement(request):
    poste=[]
    for pst in PosteBudget.objects.filter(type="fonctionnement"):
        ligne = [elt.serializable() for elt in LigneBudget.objects.filter(posteBudget__id=pst.pk)]
        poste.append({
            "id": pst.pk,
            "name": pst.name,
            "type": pst.type,
            "year": pst.year,
            "amount": sumAmount(ligne)
        })
    return JsonResponse(poste, safe=False)


@csrf_exempt
def listePosteInvestissement(request):
    poste=[]
    for pst in PosteBudget.objects.filter(type="investissement"):
        ligne = [elt.serializable() for elt in LigneBudget.objects.filter(posteBudget__id=pst.pk)]
        poste.append({
            "id": pst.pk,
            "name": pst.name,
            "type": pst.type,
            "year": pst.year,
            "amount": sumAmount(ligne)
        })
    return JsonResponse(poste, safe=False)


@csrf_exempt
def listeLigneFonctionnement(request):
    return JsonResponse([poste.serializable() for poste in LigneBudget.objects.filter(posteBudget__type="fonctionnement")], safe=False)


@csrf_exempt
def listeLigneInvestissement(request):
    return JsonResponse([ligne.serializable() for ligne in LigneBudget.objects.filter(posteBudget__type="investissement")], safe=False)



@csrf_exempt
def addBonCommande(request):
    data = (request.body).decode('utf-8')
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    bonCommande = BonCommande.objects.create(numero=data['numero'], instant=data['instant'], fournisseur=Fournisseur.objects.get(name=data['fournisseur']), cgaiDecision=0, dgDecision=0)
    for item in data['listproduits']:
        BonCommandeItem.objects.create(product=item['product'], quantity=item['quantity'], unit_price=item['unit_price'], bon_commande=bonCommande)

    return JsonResponse({})


@csrf_exempt
def closeBonCommande(request):
    data = (request.body).decode('utf-8')
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    BonCommande.objects.filter(id=data['id']).update(cgaiDecision=-1, dgDecision=-1)