from datetime import MAXYEAR, datetime, timezone
from django.db import models

# Product model
class Product(models.Model):
    name = models.CharField(max_length=200, unique=True)
    quantity = models.IntegerField()
    waitingquantity = models.IntegerField()
    security = models.IntegerField()
    warning = models.IntegerField()
    type = models.CharField(max_length=200)
    numero_compte = models.BigIntegerField()


    def serializable(self):
        return {
            "id": self.pk,
            "name": self.name,
            "quantity": self.quantity,
            "waitingquantity": self.waitingquantity,
            "security": self.security,
            "warning": self.warning,
            "type": self.type,
            "numero_compte": self.numero_compte
        }



# Services model
class Service(models.Model):
    name = models.CharField(max_length=200, unique=True)
    numero_compte = models.BigIntegerField()
 
    def serializable(self):
        return {
            "id": self.pk,
            "name": self.name,
            "numero_compte": self.numero_compte
        }



#User model
class User(models.Model):
    email = models.CharField(max_length=200, unique=True)
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
    message = models.CharField(max_length=200, default="")
    state = models.BooleanField(default=False)
    libelle = models.CharField(max_length=200, default="")

    def serializable(self):
        return {
            "id": self.pk,
            "user": self.user.name,
            "instant": str(self.instant.strftime("%x"))+" à "+str(self.instant.strftime("%X")),
            "higherDecision": self.higherDecision,
            "infoDecision": self.infoDecision,
            "message": self.message,
            "libelle": self.libelle,
            "isDraft": True if self.higherDecision==-1 else False
        }


#draft model
class Draft(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    instant = models.DateTimeField(default=datetime.now)
    libelle = models.CharField(max_length=200, default="")

    def serializable(self):
        return {
            "id": self.pk,
            "user": self.user.name,
            "instant": str(self.instant.strftime("%x"))+" à "+str(self.instant.strftime("%X")),
            "libelle": self.libelle
        }


#draftItem
class DraftItem(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    draft = models.ForeignKey(Draft, on_delete=models.CASCADE)

    def serializable(self):
        return {
            "id": self.pk,
            "product": self.product.name,
            "quantity": self.quantity,
            "draft": self.draft.pk,
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
            "send": self.sendquantity,
            "reste": self.quantity - self.sendquantity
        }


class TicketApprov(models.Model):
    approv = models.ForeignKey(Approv, on_delete=models.CASCADE)
    userDecision = models.IntegerField(default=0)
    instant = models.DateTimeField(default=datetime.now)
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
    #user=models.CharField(max_length=200)
    instant=models.DateTimeField(default=datetime.now)


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
            #"amount": sumAmount(-)
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



class Fournisseur(models.Model):
    name = models.CharField(max_length=200, unique=True)
    numero_tier = models.BigIntegerField()
    numero_compte = models.BigIntegerField()
    tva = models.FloatField(null=True)

    def serializable(self):
        return {
            "id": self.pk,
            "name": self.name,
            "numero_tier": self.numero_tier,
            "numero_compte": self.numero_compte,
            "tva": self.tva
        }


class BonCommande(models.Model):
    instant = models.DateTimeField(auto_now_add=True)
    fournisseur = models.ForeignKey(Fournisseur, on_delete=models.CASCADE)
    numero_piece = models.CharField(max_length=200)
    cgaiDecision = models.IntegerField()
    dgDecision = models.IntegerField()
    ligneBudget = models.ForeignKey(LigneBudget, models.CASCADE)
    state = models.BooleanField(default=True)
    #documents = models. 

    def serializable(self):
        return {
            "id": self.pk,
            "instant": str(self.instant.strftime("%x"))+" à "+str(self.instant.strftime("%X")),
            "fournisseur": self.fournisseur,
            "numero_piece": self.numero_piece,
            "cgaiDecision": self.cgaiDecision,
            "dgDecision": self.dgDecision,
            "tva": self.tva
        }


class BonCommandeItem(models.Model):
    product = models.CharField(max_length=200)
    unit_price = models.IntegerField()
    quantity = models.IntegerField()
    bon_commande = models.ForeignKey(BonCommande, on_delete=models.CASCADE)

    def serializable(self):
        return {
            "id": self.pk,
            "product": self.product,
            "unit_price": self.unit_price,
            "quantity": self.quantity,
            "bon_commande": self.bon_commande.pk
        }