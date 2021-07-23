from django.http import JsonResponse
from ..models import Product, Fournisseur, Service
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from .auth import tokenVerification

@csrf_exempt
def listproduits(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([product.serializable() for product in Product.objects.all().order_by('name')], safe=False)

@csrf_exempt
def listfournisseurs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([item.serializable() for item in Fournisseur.objects.all().order_by('name')], safe=False)


@csrf_exempt
def listservices(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    return JsonResponse([item.serializable() for item in Service.objects.all().order_by('name')], safe=False)


@csrf_exempt
def addproduit(request):
    if request.method == 'POST':
        product = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.create( name=product['name'], quantity=product['quantity'], security=product['security'], warning=product['warning'], type=product["type"], waitingquantity=product['quantity'], numero_compte=product['numero_compte'])
    return JsonResponse({'message': "well done" })

@csrf_exempt
def addservice(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Service.objects.create( name=data['name'], numero_compte=data['numero_compte'])
    return JsonResponse({'message': "well done" })

@csrf_exempt
def addfournisseur(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.create( name=data['name'], numero_tier=data['numero_tier'], numero_compte=data['numero_compte'], tva=data['tva'])
    return JsonResponse({'message': "well done" }) 


@csrf_exempt
def updateproduit(request):
    if request.method == 'POST':
        produit = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Product.objects.filter(id=produit["id"]).update(name=produit["name"], quantity=produit["quantity"], security=produit["security"], warning=produit["warning"], type=produit["type"], numero_compte=produit['numero_compte'])
    return JsonResponse({'message': 'Mise à jour reussi' })

@csrf_exempt
def updatefournisseur(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Fournisseur.objects.filter(id=data["id"]).update(name=data["name"], numero_compte=data["numero_compte"], numero_tier=data["numero_tier"], tva=data['tva'])
    return JsonResponse({'message': 'Mise à jour reussi' })

@csrf_exempt
def updateservice(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        Service.objects.filter(id=data["id"]).update(name=data["name"], numero_compte=data['numero_compte'])
    return JsonResponse({'message': 'Mise à jour reussi' })


@csrf_exempt
def deleteproduit(request):
    if request.method == 'POST':
        produit = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        prod = Product.objects.get(pk=produit['id'])
        prod.delete()
    return JsonResponse({'message': 'Suppression reussi' })


@csrf_exempt
def deletefournisseur(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        prod = Fournisseur.objects.get(pk=data['id'])
        prod.delete()
    return JsonResponse({'message': 'Suppression reussi' })

@csrf_exempt
def deleteservice(request):
    if request.method == 'POST':
        data = json.loads((request.body).decode('utf-8'))
        payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
        prod = Service.objects.get(pk=data['id'])
        prod.delete()
    return JsonResponse({'message': 'Suppression reussi' })

