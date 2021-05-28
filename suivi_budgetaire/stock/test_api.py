from django.core.files.storage import FileSystemStorage
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import UploadFile, User


@csrf_exempt
def saveFile(request):
    req = request.body
    uploaded_file = request.FILES['image']
    #print(uploaded_file)
    a=UploadFile.objects.all()
    #print(a.cover)
    print(a[0].cover.path)
    print(a[0].cover.url)
    
    return JsonResponse({})