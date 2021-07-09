from django.http import JsonResponse
from ..models import User 
from django.views.decorators.csrf import csrf_exempt
import json
import jwt
from datetime import datetime, timedelta
import bcrypt
from django.core.mail import send_mail, EmailMultiAlternatives

JWT_SECRET = 'secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 50000

def tokenVerification(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except (jwt.DecodeError, jwt.ExpiredSignatureError):
        return {"message": "token expiré"}
    return payload

@csrf_exempt
def sendingMail(receiver, name):
    subject = "Ticket approvision"
    message = "Bonjour monsieur {0}, veillez confirmer la reception du matériel recu".format(name)
    send_mail(subject, message, 'jerarlmalim@gmail.com' , [receiver], fail_silently = False)


@csrf_exempt
def signup(request):
    data = json.loads((request.body).decode('utf8'))
    try:
        User.objects.get(email=data['courriel'], name=data['name'])
        return JsonResponse({'message': 'Cette utilisateur existe déjà' })
    except(User.DoesNotExist):
        passwd = bcrypt.hashpw(data["password"].encode('utf8'), bcrypt.gensalt())
        if(data["superieur"]):
            user = User.objects.get(id=data["superieur"])
            User.objects.create(name=data['name'], email=data["courriel"], password=passwd.decode('utf8'), higher=user, role=data["role"])
        else:
            User.objects.create(name=data['name'], email=data["courriel"], password=passwd.decode('utf8'), role=data["role"])
    
    return JsonResponse({'message': 'Inscription reussi' })


@csrf_exempt
def login(request):
    data = json.loads((request.body).decode('utf8'))
    try:
        user = User.objects.get(email=data['courriel'])
        if(bcrypt.checkpw(data["password"].encode('utf-8'), (user.password).encode('utf-8'))):
            hasInferior = User.objects.filter(higher__pk=user.id)
            if(hasInferior):
                payload = {
                    'user_id': user.id,
                    'role': user.role,
                    'name': user.name,
                    'hasInferior': True,
                    'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
                    }
                jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)
                return JsonResponse({'token': jwt_token.decode('utf-8')}, status=200)
            else:
                payload = {
                    'user_id': user.id,
                    'role': user.role,
                    'name': user.name,
                    'hasInferior': False,
                    'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
                    }
                            
                jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)
                return JsonResponse({'token': jwt_token.decode('utf-8')}, status=200)

        else:
            return JsonResponse({'message': 'Wrong credentials'}, status=400)
       
    except (User.DoesNotExist):
        return JsonResponse({'message': 'Wrong credentials'}, status=400)



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

            subject = "Mot de passe oublié"
            html_content = "Une requete de mot de passe oublié a été signalé pour votre compte. Si vous etes à l origine cliquez <a href='http://172.16.16.195:4200/reset-password/{0}'>--ici--</a> , sinon ne faites rien ".format(jwt_token.decode('utf-8'))
            msg = EmailMultiAlternatives(subject, "", 'jerarlmalim@gmail.com' , [email])
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
            pwd = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            User.objects.filter(email= data['email']).update(password=pwd.decode('utf-8'))

    except(User.DoesNotExist):
        JsonResponse({'message': 'Cette adresse n existe pas'})

    return JsonResponse({})



@csrf_exempt
def listuser(request):
    return JsonResponse([user.serializable() for user in User.objects.all()],  safe=False) 