from django.http import JsonResponse
from ..models import Product
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from .auth import tokenVerification

@csrf_exempt
def listproduits(request):
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