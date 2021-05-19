import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { ApprovsService } from '../services/approvs.service';
import { ProduitsService } from '../services/produits.service';
import { Router } from '@angular/router';
import { TicketApprovService } from '../services/ticket-approv.service';
import jwt_token from 'jwt-decode';
import { environment } from 'src/environments/environment';
declare  var jQuery:  any;


@Component({
  selector: 'app-approv',
  templateUrl: './approv.component.html',
  styleUrls: ['./approv.component.css']
})
export class ApprovComponent implements OnInit {
  display:boolean;
  @Input() ticketApprovs=[];
  @Input() personnalTicketApprovs=[];
  @Input() ticketApprovsItems=[];
  
  @Input() d;
  @Input() approvs=[];
  @Input() otherApprovs=[];
  @Input() specialApprovs=[];
  @Input() id;
  @Input() approvStats;

  @Input() allApprovsItems =[];
  @Input() new_produit;
  @Input() quantity;
  @Input() produits=[];
  @Input() e;
  @Input() message;
  p: boolean;
  listproduits=[];
  listproduitsSubject = new Subject<any[]>();
  approvsItemsSubscription = new Subscription;
  approvsSubscription: Subscription;
  listproduitsSubscription: Subscription;
  otherApprovsSubscription: Subscription;
  specialApprovsSubscription: Subscription;
  //ticket approvissionnement
  personnalTicketApprovsSubscription: Subscription;
  approvStatsSubscription: Subscription;
  ticketApprovsItemsSubscription = new Subscription;
  ticketApprovsSubscription: Subscription;
  role=jwt_token(window.localStorage.getItem("token"));
  testing = new Array();


  constructor(private route: Router, private approvsService: ApprovsService, private produitsService: ProduitsService, private httpClient: HttpClient, private ticketApprovsService: TicketApprovService) { }
  ngOnInit(): void {
    this.role = this.role['role'];
    //this.produitsService.listProduits();
    //this.produitsService.produits);
    this.httpClient.get(environment.url + "listproduits")
      .subscribe(
        (data: any[])=>{
          this.produits = data;
          console.log("reussite lors de la récuperation des produits");
        },
        (error)=>{
          console.log("probleme lors de la récuperation des produits" + error);
        }
      ); 
    this.ticketApprovsService.listPersonnalTicketApprovs();
    this.ticketApprovsService.listTicketApprovs();
    this.ticketApprovsService.listTicketApprovsItems();
    this.approvsService.listApprovs();
    this.approvsService.listInferiorApprovs();
    this.approvsService.listApprovsItems();
    this.approvsService.listSpecialApprovs();
    this.approvsService.getApprovStats();
    this.approvStatsSubscription = this.approvsService.approvstatsSubject.subscribe(
      (data)=>{this.approvStats = data;}
    )
    //zone ticket
    this.ticketApprovsSubscription = this.ticketApprovsService.ticketApprovsSubject.subscribe(
      (data)=>{
        this.ticketApprovs = data;  
      }
    );
    this.ticketApprovsItemsSubscription = this.ticketApprovsService.ticketApprovsItemsSubject.subscribe(
      (data)=>{
        this.ticketApprovsItems = data;  
      }
    );
    this.personnalTicketApprovsSubscription = this.ticketApprovsService.personnalTicketApprovsSubject.subscribe(
      (data)=>{
        this.personnalTicketApprovs = data;  
      }
    );
    //fin zone ticket
    this.approvsSubscription = this.approvsService.approvsSubject.subscribe(
      (data)=>{
        this.approvs = data;  
      }
    );
    this.approvsItemsSubscription = this.approvsService.approvsItemsSubject.subscribe(
      (data)=>{
        this.allApprovsItems = data;  
      }
    );
    this.otherApprovsSubscription = this.approvsService.inferiorApprovsSubject.subscribe(
      (data)=>{
        this.otherApprovs = data;  
      }
    );
    this.specialApprovsSubscription = this.approvsService.specialApprovsSubject.subscribe(
      (data)=>{
        this.specialApprovs = data;  
      }
    );
    this.listproduitsSubscription = this.listproduitsSubject.subscribe(
      (data)=>{this.listproduits=data;}
    );
 
  }

  updateDisplay(status){
    if(status=='True'){this.display=true} else{this.display=false}
  }

  closeModal(){
    (function ($) {
      $(document).ready(function(){
        $('.modal').modal('hide');
      });
    })(jQuery);
  }

  addApprov(){
      if(this.listproduits.length>0){this.approvsService.addApprov(this.listproduits);}
      this.closeModal();
  }

  /** searchother(){
    this.approvsOtherSearch = []; 
    if(!this.e){this.e="";}
    p: RegExp("  ","g");
    this.e=this.e.replace(this.p," ");
    this.e=this.e.toLowerCase();
    for(let produit of this.approvsOtherFilter){
      this.p=false;
      if(String(produit.user_name).toLowerCase().search(this.e)!=-1){
        this.p=true;
      }
      if(this.p){
        this.approvsOtherSearch.push(produit);
      }
    }    
  } **/
 

  deleteapprov(id){
    this.approvsService.deleteApprov(id);
  }
  lockapprov(id){
    let p = confirm("voulez-vous vraiment fermer cet approvisionnement ?");
    if(p){this.approvsService.lockApprov(id);}
  }

  updateListProd(){
    let p = false;
    //if(this.new_produit && this.quantity)
    for(let i=0; i<this.listproduits.length; i++){
      if(this.listproduits[i].product===this.new_produit){
        p=true;
        this.listproduits[i].quantity = this.quantity;
        this.listproduitsSubject.next(this.listproduits.slice());
      }
    }
    
   let produit ={
      quantity: this.quantity,
      product: this.new_produit,
    } 
    
  if(!p){
    this.listproduits.push(produit);
    this.listproduitsSubject.next(this.listproduits.slice());
  } 
        
  }

  updateitem(){
    let p = false;
    for(let i=0; i<this.listproduits.length; i++){
      if(this.listproduits[i].product===this.new_produit){
        p=true;
        this.listproduits[i].quantity = this.quantity;
        this.listproduitsSubject.next(this.listproduits.slice());
      }
    }
    
   let produit ={
      quantity: this.quantity,
      product: this.new_produit,
      approv: this.id
    } 
    
  if(!p){
    this.listproduits.push(produit);
    this.listproduitsSubject.next(this.listproduits.slice());
  }  
        
  }

  resetList(){
    this.listproduits=[];
    this.listproduitsSubject.next(this.listproduits.slice());
  }


  modification(index){
    this.quantity = this.listproduits[index].quantity;
    this.new_produit= this.listproduits[index].product;
  }

  deleteitem(index){
    this.listproduits.splice(index,1);
    this.listproduitsSubject.next(this.listproduits.slice());
  }

  infoApprovs(id, type){
    this.id=id;
    if(type=='ticket'){
      let liste=[];
      this.listproduits = this.allApprovsItems.filter(approv=>approv.approv==id);
      for(let i=0; i<this.listproduits.length; i++){
        liste[i]={
          approv: this.listproduits[i].approv,
          product: this.listproduits[i].product,
          quantity: this.listproduits[i].quantity,
          waitingquantity: this.produits.find(p=>p.name==this.listproduits[i].product)['waitingquantity'],
          send: 0
        };
      }
      this.listproduits = liste;
      //this.listproduits = liste.map(this.transform)
    }
    else{
      this.listproduits = this.allApprovsItems.filter(approv=>approv.approv==id);
    }
    
  }

  infoTicketApprovs(id){
    this.id=id;
    this.listproduits = this.ticketApprovsItems.filter(ticket=>ticket.ticketapprov==id);
  }

  listTicketApprov(id){
    this.listproduits = this.ticketApprovs.filter(ticket=>ticket.approv==id);
  }

  transform(approvItem){ 
    return {
      approv: approvItem.approv,
      product: approvItem.product,
      quantity: approvItem.quantity,
      send: 0
    }
  }

  decision(property, role){
    let message="";
    if(property=='valider'){this.approvsService.decision('1', this.id, message, role);}
    else if(property=='rejeter'){ message=window.prompt("Quel est la raison du rejet?"); this.approvsService.decision('2', this.id, message, role);}
    else{message=window.prompt("Quel est la raison de l'annulation?"); this.approvsService.decision('3', this.id, message, role);}
    this.closeModal();
  }

  decisionTicket(property){
    let message="";
    if(property=='valider'){this.ticketApprovsService.decision('1', this.id, message);}
    else if(property=='rejeter'){ message=window.prompt("Quel est la raison du rejet?"); this.ticketApprovsService.decision('2', this.id, message);}
    this.closeModal();
  }


  modifApprovs(){
    if(this.listproduits.length>0){this.approvsService.modifApprovs(this.listproduits);}
    this.closeModal();
  }
  
  sendCoupon(){
    if(this.listproduits.length>0){this.ticketApprovsService.addApprovTicket(this.listproduits);}
    this.closeModal();
  }
  
  sendCoupon1(){
    if(this.listproduits.length>0){this.ticketApprovsService.modifTicketApprovs(this.listproduits);}
    this.closeModal();
  }

  changeValue(index, property){
    let value = parseInt(document.getElementsByClassName('send_value')[index]['value']);
    this.listproduits[index][property] =(value>0) ? value : -value;
    this.listproduitsSubject.next(this.listproduits.slice());
  }

  changeValue1(index, property){
    this.listproduits[index][property] =parseInt(document.getElementsByClassName('send_value1')[index]['value']);
    this.listproduitsSubject.next(this.listproduits.slice());
  }
  
  deleteTicketApprovs(id){
    let p = confirm("Voulez-vous vraiment supprimer ?");
    if(p){this.ticketApprovsService.deleteApprovTicket(id);}
    
  }
}
