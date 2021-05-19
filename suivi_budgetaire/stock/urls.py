from django.urls import path
from . import views
from . import ticket_approv

urlpatterns = [
    path('listproduits/', views.listproduits, name='1'),
    path('addproduit/', views.addproduit, name='2'),
    path('updateproduit/', views.updateproduit, name='3'),
    path('deleteproduit/', views.deleteproduit, name='4'),
    path('addapprov/', views.addapprov, name='5'),
    path('modifapprov/', views.modifapprov, name='6'),
    path('listapprovs/', views.listapprovs, name='7'),
    path('decisionapprov/', views.decisionapprovs, name='8'),
    path('signin/', views.login, name='9'),
    path('signup/', views.signup, name='10'),
    path('listuser', views.listuser, name='11'),
    path('specialapprovs/', views.specialapprovs, name='12'),
    path('listinferiorapprovs/', views.listinferiorapprovs, name='13'),
    path('listapprovsitems/', views.listapprovsitems, name='14'),
    path('deleteapprov/', views.deleteapprov, name='15'),
    path('lockapprov/', views.lockapprov, name='26'),
    #ticket
    path('listapprovsticketitems/', ticket_approv.listTicketApprovsItem, name='16'),
    path('listapprovsticket/', ticket_approv.listTicketApprovs, name='17'),
    path('personnalapprovsticket/', ticket_approv.listPersonnalTicketApprovs, name='18'),
    path('addapprovticket/', ticket_approv.addTicketApprovs, name='19'),
    path('deleteapprovticket/', ticket_approv.deleteTicketApprov, name='20'),
    path('modifapprovticket/', ticket_approv.modifTicketApprov, name='21'),
    path('decisionapprovticket/', ticket_approv.decisionTicketApprov, name='22'),
    path('approvstats/', ticket_approv.approvStats, name='27'),
    path('sendFile/', ticket_approv.saveFile, name='28')
    

]