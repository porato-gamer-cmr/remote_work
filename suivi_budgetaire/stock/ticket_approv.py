from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from .models import TicketApprov, TicketApprovItem, Approv, Product, User
from django.db.models import F
import json
from django.views.decorators.csrf import csrf_exempt
import jwt
from datetime import datetime, timedelta
from django.core.mail import send_mail
from .views import tokenVerification

JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 50000


@csrf_exempt
def approvStats(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    allApprov = Approv.objects.filter(user__id = payload['user_id']).count()
    successApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=1, infoDecision=1).count()
    rejectApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=2).filter(user__id = payload['user_id'], infoDecision=2).count()
    cancelApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=3).filter(user__id = payload['user_id'], infoDecision=3).count()
    waitingApprov = Approv.objects.filter(user__id = payload['user_id'], higherDecision=1, infoDecision=0).count() + Approv.objects.filter(user__id = payload['user_id'], higherDecision=0, infoDecision=1).count() + Approv.objects.filter(user__id = payload['user_id'], higherDecision=0, infoDecision=0).count()
    print(allApprov)
    return JsonResponse({"all": allApprov, "success": successApprov, "reject": rejectApprov, "cancel": cancelApprov, "waiting": waitingApprov})


@csrf_exempt
def decisionTicketApprov(request):
    req = request.body
    my_json = req.decode('utf8').replace("'", '"')
    data=json.loads(my_json)
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    TicketApprov.objects.filter(id=data["id"]).update(userDecision=data["decision"], message=data["message"])
    if data["decision"]==1 :
        for item in TicketApprovItem.objects.filter(ticketapprov=data['id']):
            Product.objects.filter(name=item.product).update(quantity=F('quantity')-item.sendquantity)
    return JsonResponse({"message": "well done"})


@csrf_exempt
def sendingMail(receiver, name):
    subject = "Ticket approvision"
    message = "Bonjour monsieur {name}, veillez confirmer la reception du matériel recu".format(name=name)
    send_mail(subject, message, 'jerarlmalim@gmail.com' , [receiver], fail_silently = False)


@csrf_exempt
def listTicketApprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprovs = TicketApprov.objects.all()
    ticket=[]
    for a in ticketApprovs:
        app={
            "id": a.pk,
            "approv": a.approv.pk,
            "instant": str(a.instant.strftime("%x"))+" à "+str(a.instant.strftime("%X")),
            "userDecision": a.userDecision,
            "message": a.message,
            "user" : a.approv.user.name
            }
        ticket.append(app)
    return JsonResponse(ticket, safe=False)


@csrf_exempt
def listPersonnalTicketApprovs(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprovs = TicketApprov.objects.filter(approv__user__id=payload['user_id'])
    ticket=[]
    for a in ticketApprovs:
        app={
            "id": a.pk,
            "instant": str(a.instant.strftime("%x"))+" à "+str(a.instant.strftime("%X")),
            "userDecision": a.userDecision,
            "message": a.message
            }
        ticket.append(app)
    return JsonResponse(ticket, safe=False)



@csrf_exempt
def listTicketApprovsItem(request):
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprovsItem = TicketApprovItem.objects.all()
    ticket=[]
    for a in ticketApprovsItem:
        app={
            "id": a.pk,
            "ticketapprov": a.ticketapprov.pk,
            "product": a.product,
            "initialquantity": a.initialquantity,
            "sendquantity": a.sendquantity
            }
        ticket.append(app)
    return JsonResponse(ticket, safe=False)


@csrf_exempt
def addTicketApprovs(request):
    req = request.body
    my_json = req.decode('utf8').replace("'", '"')
    my_json = my_json.replace(",{", ";{")
    my_json = my_json.replace("[", "")
    my_json = my_json.replace("]", "")
    app = my_json.split(";")
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    ticketApprov = TicketApprov.objects.create(approv=Approv.objects.get( id=(json.loads(app[0]))["approv"] ), message="")
    ticketApprov.save()
    """for item in app:
        if (item['send'] >  Product.objects.filter(name=item['product']).waitingquantity ):
            return JsonResponse({'message': 'Le ticket ne peut etre créé car certains produits ne sont pas suffissant en stock'})"""
    for item in app:
        item=json.loads(item)
        TicketApprovItem.objects.create(product=item['product'], sendquantity=item['send'], initialquantity=item['quantity'], ticketapprov=ticketApprov)
        Product.objects.filter(name=item['product']).update(waitingquantity=F('waitingquantity')-item['send'])
    data=Approv.objects.get( id=(json.loads(app[0]) )["approv"] )
    sendingMail(data.user.email, data.user.name)
    return JsonResponse({})


@csrf_exempt
def modifTicketApprov(request):
    req = request.body
    my_json = req.decode('utf8').replace("'", '"')
    my_json = my_json.replace(",{", ";{")
    my_json = my_json.replace("[", "")
    my_json = my_json.replace("]", "")
    app = my_json.split(";")
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    #TicketApprovItem.objects.filter(ticketapprov=(json.loads(app[0]))['ticketapprov']).delete()
    ticketApprov = TicketApprov.objects.get(id=(json.loads(app[0]))['ticketapprov'])
    for item in app:
        item = json.loads(item)
        Product.objects.filter(name=item['product']).update(waitingquantity=F('waitingquantity') + TicketApprovItem.objects.filter(ticketapprov=item['ticketapprov'], product=item['product'])[0].sendquantity )
        Product.objects.filter(name=item['product']).update(waitingquantity=F('waitingquantity') - item['sendquantity'])
        TicketApprovItem.objects.filter(ticketapprov=item['ticketapprov'], product=item['product']).update(sendquantity=item['sendquantity'])
    return JsonResponse({"message": "well done"})


@csrf_exempt
def deleteTicketApprov(request):
    req = request.body
    payload = tokenVerification(request.headers['Authorization'].split(' ')[1])
    my_json = req.decode('utf8')
    data=json.loads(my_json)
    TicketApprov.objects.get(id=data['id']).delete()
    return JsonResponse({"message": "well done"})


@csrf_exempt
def saveFile(request):
    req = request.body
    print(request.FILES)
    print(request.POST)
    print(request.body)


    return JsonResponse({})



