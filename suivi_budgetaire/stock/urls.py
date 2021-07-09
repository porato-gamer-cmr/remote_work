from django.urls import path
from .views import auth
from .views import produit
from .views import budget
from .views import approv
from .views import ticket_approv

urlpatterns = [
    #produits
    path('listproduits/', produit.listproduits, name='1'),
    path('addproduit/', produit.addproduit, name='2'),
    path('updateproduit/', produit.updateproduit, name='3'),
    path('deleteproduit/', produit.deleteproduit, name='4'),
    #approvisionnement
    path('addapprov/', approv.addapprov, name='5'),
    path('modifapprov/', approv.modifapprov, name='6'),
    path('listapprovs/', approv.listapprovs, name='7'),
    path('decisionapprov/', approv.decisionapprovs, name='8'),
    path('specialapprovs/', approv.specialapprovs, name='9'),
    path('listinferiorapprovs/', approv.listinferiorapprovs, name='10'),
    path('listapprovsitems/', approv.listapprovsitems, name='11'),
    path('deleteapprov/', approv.deleteapprov, name='12'),
    path('lockapprov/', approv.lockapprov, name='13'),
    path('approvstats/', approv.approvStats, name='14'),
    #authentification
    path('signin/', auth.login, name='15'),
    path('signup/', auth.signup, name='16'),
    path('listuser', auth.listuser, name='17'),
    path('changePassword/', auth.changePassword, name='18'),
    path('forgetPassword/', auth.forgetPassword, name='19'),
    path('resetPassword/', auth.resetPassword, name='20'),
    #ticketApprovisionnement
    path('listapprovsticketitems/', ticket_approv.listTicketApprovsItem, name='21'),
    path('listapprovsticket/', ticket_approv.listTicketApprovs, name='22'),
    path('personnalapprovsticket/', ticket_approv.listPersonnalTicketApprovs, name='23'),
    path('addapprovticket/', ticket_approv.addTicketApprovs, name='24'),
    path('deleteapprovticket/', ticket_approv.deleteTicketApprov, name='25'),
    path('modifapprovticket/', ticket_approv.modifTicketApprov, name='26'),
    path('decisionapprovticket/', ticket_approv.decisionTicketApprov, name='27'),
    #budget
    path('newPoste/', budget.newPoste, name='28'),
    path('editPoste/', budget.editPoste, name='29'),
    path('allPosteFonctionnement/', budget.listePosteFonctionnement, name='30'),
    path('allLigneFonctionnement/', budget.listeLigneFonctionnement, name='31'),
    path('allPosteInvestissement/', budget.listePosteInvestissement, name='32'),
    path('allLigneInvestissement/', budget.listeLigneInvestissement, name='32'),

]