from django.db import models

# Product model
class Product(models.Model):
    name = models.CharField(max_length=200, unique=True)
    quantity = models.IntegerField()
    waitingquantity = models.IntegerField()
    security = models.IntegerField()
    warning = models.IntegerField()
    type = models.CharField(max_length=200)

    def serializable(self):
        return {
            "id": self.pk,
            "name": self.name,
            "quantity": self.quantity,
            "waitingquantity": self.waitingquantity,
            "security": self.security,
            "warning": self.warning,
            "type": self.type
        }

#User model
class User(models.Model):
    email = models.CharField(max_length=200, unique=True)
    #email = models.EmailField(unique=True)
    name = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)
    higher = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    role = models.CharField(max_length=200)

    def serializable(self):
        return {
            "id": self.pk,
            "email": self.email,
            "name": self.name,
            "password": self.password,
            "role": self.role
        }

#approv model
class Approv(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    instant = models.DateTimeField(auto_now_add=True)
    higherDecision = models.IntegerField()
    infoDecision = models.IntegerField()
    message = models.CharField(max_length=200)
    state = models.BooleanField(default=False)

    def serializable(self):
        return {
            "id": self.pk,
            "user": self.user.name,
            "instant": self.instant,
            "higherDecision": self.higherDecision,
            "infoDecision": self.infoDecision,
            "message": self.message
        }


#ApprovItem model
class ApprovItem(models.Model):
    #we don't add ondelete parameter to product because we need ApprovItem history
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    approv = models.ForeignKey(Approv, on_delete=models.CASCADE)
    sendquantity = models.IntegerField(default=0)

    def serializable(self):
        return {
            "id": self.pk,
            "product": self.product.name,
            "quantity": self.quantity,
            "approv": self.approv.pk,
            "sendquantity": self.sendquantity
        }


class TicketApprov(models.Model):
    approv = models.ForeignKey(Approv, on_delete=models.CASCADE)
    userDecision = models.IntegerField(default=0)
    instant = models.DateTimeField(auto_now_add=True)
    message = models.CharField(max_length=200)

    def serializable(self):
        return {
            "id": self.pk,
            "approv": self.approv.pk,
            "instant": str(self.instant.strftime("%x"))+" à "+str(self.instant.strftime("%X")),
            "userDecision": self.userDecision,
            "message": self.message,
            "user" : self.approv.user.name
        }



class TicketApprovItem(models.Model):
    product = models.CharField(max_length=200)
    initialquantity = models.IntegerField()
    sendquantity = models.IntegerField()
    ticketapprov = models.ForeignKey(TicketApprov, on_delete=models.CASCADE)

    def serializable(self):
        return {
            "id": self.pk,
            "ticketapprov": self.ticketapprov.pk,
            "product": self.product,
            "initialquantity": self.initialquantity,
            "sendquantity": self.sendquantity
        }

#Log model user, date and action 
class Log(models.Model):
    user=models.CharField(max_length=200)


#model for file upload 
class UploadFile(models.Model):
    title = models.TextField(default="texte par defaut")
    cover = models.ImageField(upload_to='images/', null=True, blank=True)



class PosteBudget(models.Model):
    name = models.TextField(max_length=255)
    type = models.CharField(max_length=255)
    year = models.IntegerField(null=False)

    def serializable(self):
        return {
            "id": self.pk,
            "name": self.name,
            "type": self.type,
            "year": self.year,
            #"amount": sumAmount([elt.serializable() for elt in LigneBudget.objects.filter(posteBudget__id=self.pk)])
        }


class LigneBudget(models.Model):
    name = models.CharField(max_length=255)
    amount = models.IntegerField(null=False)
    posteBudget = models.ForeignKey(PosteBudget, on_delete= models.CASCADE)

    def serializable(self):
        return {
            "id": self.pk,
            "name": self.name,
            "amount": self.amount,
            "poste": self.posteBudget.pk,
        }