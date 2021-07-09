from django.http import JsonResponse, FileResponse
from django.shortcuts import render
from ..models import ApprovItem, TicketApprov, TicketApprovItem, Approv, Product, LigneBudget, PosteBudget
from django.db.models import F
import json
from django.views.decorators.csrf import csrf_exempt
import jwt
from datetime import datetime
from .auth import sendingMail
from .auth import tokenVerification

JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 50000


@csrf_exempt
def decisionTicketApprov(request):
    data=json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    TicketApprov.objects.filter(id=data["id"]).update(userDecision=data["decision"], message=data["message"])
    if data["decision"]==1 :
        for item in TicketApprovItem.objects.filter(ticketapprov=data['id']):
            Product.objects.filter(name=item.product).update(quantity=F('quantity')-item.sendquantity)
    return JsonResponse({"message": "well done"})



@csrf_exempt
def listTicketApprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprovs = TicketApprov.objects.all()
    return JsonResponse([ticket.serializable() for ticket in ticketApprovs],  safe=False)


@csrf_exempt
def listPersonnalTicketApprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprovs = TicketApprov.objects.filter(approv__user__id=payload['user_id']).exclude(userDecision=1)
    return JsonResponse([ticket.serializable() for ticket in ticketApprovs],  safe=False)



@csrf_exempt
def listTicketApprovsItem(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprovsItem = TicketApprovItem.objects.all()
    return JsonResponse([ticket.serializable() for ticket in ticketApprovsItem],  safe=False)


@csrf_exempt
def addTicketApprovs(request):
    data = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprov = TicketApprov.objects.create(approv=Approv.objects.get(id=data['listproduits'][0]['approv']), message=data['message'])
    for item in data['listproduits']:
        TicketApprovItem.objects.create(product=item['product'], sendquantity=item['send'], initialquantity=item['quantity'], ticketapprov=ticketApprov)
        Product.objects.filter(name=item['product']).update(waitingquantity=F('waitingquantity')-item['send'])
        ApprovItem.objects.filter(product__name=item['product'], approv=Approv.objects.get(id=data['listproduits'][0]['approv'])).update(sendquantity=F('sendquantity')+item['send'])
    #data=Approv.objects.get( id = data['listproduits'][0]['approv'] )
    #send_mail("livraison", "VOus avez recu du materiel", 'jerarlmalim@gmail.com' , [data.user.email], fail_silently = False)
    #send_mail("livraison", "le materiel a ete livré à {0}".format(data.user.email), 'jerarlmalim@gmail.com' , [data.user.higher.name], fail_silently = False)
    #sendingMail(data.user.email, data.user.name)
    #sendingMail(data.user.higher.email, data.user.higher.name)
    return JsonResponse({})


@csrf_exempt
def modifTicketApprov(request):
    data = json.loads((request.body).decode('utf-8'))
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    TicketApprov.objects.filter(id=data['listproduits'][0]['ticketapprov']).update(message=data['message'])
    ticketApprov = TicketApprov.objects.get(id=data['listproduits'][0]['ticketapprov'])
    for item in data['listproduits']:
        Product.objects.filter(name=item['product']).update(waitingquantity=F('waitingquantity') + TicketApprovItem.objects.filter(ticketapprov=item['ticketapprov'], product=item['product'])[0].sendquantity )
        Product.objects.filter(name=item['product']).update(waitingquantity=F('waitingquantity') - item['sendquantity'])
        ApprovItem.objects.filter(product__name=item['product'], approv=ticketApprov.approv).update(sendquantity=F('sendquantity') - TicketApprovItem.objects.filter(ticketapprov=item['ticketapprov'], product=item['product'])[0].sendquantity)
        ApprovItem.objects.filter(product__name=item['product'], approv=ticketApprov.approv).update(sendquantity=F('sendquantity') + item['sendquantity'])
        TicketApprovItem.objects.filter(ticketapprov=item['ticketapprov'], product=item['product']).update(sendquantity=item['sendquantity'])
        
        #sendingMail(data.user.email, data.user.name)
        #sendingMail(data.user.higher.email, data.user.higher.name)
    return JsonResponse({"message": "well done"})


@csrf_exempt
def deleteTicketApprov(request):
    data=json.loads((request.body).decode('utf-8'))
    TicketApprov.objects.get(id=data['id']).delete()
    return JsonResponse({"message": "well done"})






