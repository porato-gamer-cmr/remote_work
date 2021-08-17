import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
//declare  var jQuery:  any;
import jsPDF from 'jspdf';
//import pdfMake from 'pdfmake/build/pdfmake';
//import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;
//import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';
import { ProduitsService } from '../_services/produits.service';
import { environment } from 'src/environments/environment';
import { ReapprovsService } from '../_services/reapprovs.service';
import { Subscription, timer } from 'rxjs';
import jwt_token from 'jwt-decode';
import { NumberToLetter } from 'convertir-nombre-lettre';

@Component({
  selector: 'app-reapprov',
  templateUrl: './reapprov.component.html',
  styleUrls: ['./reapprov.component.css']
})
export class ReapprovComponent implements OnInit {

  listproduits=[];
  id;
  role=(jwt_token(window.localStorage.getItem("token")))['role'];
  produits=[];
  services=[];
  fournisseurs=[];
  ligne_budgets = [];
  files = [];
  file = [];
  @Input() product;
  @Input() unit_price;
  @Input() quantity;
  @Input() bill_price = 0;
  @Input() htc_price = 0;
  @Input() tva_price = 0;
  tva=0;
  montant_en_lettre;
  @Input() fournisseur;
  @Input() ligne_budget;
  @Input() numero_piece;
  @Input() date=new Date();
  @Input() bonCommandes=[];
  @Input() bonCommandesItems=[];
  bonCommandeSubscription: Subscription;
  bonCommandeItemSubscription: Subscription;
  filesSubscription: Subscription;
  subscription: Subscription;
  printable=false;
  
  constructor(private httpClient: HttpClient, private produitService: ProduitsService, private reapprovService: ReapprovsService) { }
  ngOnInit() { 
    this.httpClient.get(environment.url+"allLigneInvestissement/").subscribe(
      (data: any[])=>{
         for (let i=0; i<data.length; i++){ this.ligne_budgets.push(data[i]);}
       }
    );
    this.httpClient.get(environment.url+"listproduits/").subscribe(
      (data: any[])=>{
        for (let i=0; i<data.length; i++){ this.produits.push(data[i]);}
       }
    );
    this.httpClient.get(environment.url+"listService/").subscribe(
      (data: any[])=>{
        for (let i=0; i<data.length; i++){ this.produits.push(data[i]);}
       }
    );
    this.httpClient.get(environment.url+'listFournisseur').subscribe(
      (data: any[])=>{
        this.fournisseurs = data;
        console.log("Réussite lors de la recuperation des fournisseurs");
      },
      (error)=>{
        console.log("erreur lors de la récuperation des fournisseurs");
      }
    );
    this.filesSubscription = this.reapprovService.filesSubject.subscribe(
      (data)=>{
        this.files = data;
        this.file = this.files.filter(e=>e.bon_commande == this.id);
      }
    );
    this.httpClient.get(environment.url+"allLigneFonctionnement/").subscribe(
      (data: any[])=>{
        for (let i=0; i<data.length; i++){ this.ligne_budgets.push(data[i]) ;}
      }
    );
    
    this.reapprovService.listBonCommandeItem();
    this.reapprovService.listBonCommande();
    this.reapprovService.allFile();
    
    this.bonCommandeSubscription = this.reapprovService.bonCommandeSubject.subscribe(
      (data)=>{
        this.bonCommandes=data;      }
    );
    this.bonCommandeItemSubscription = this.reapprovService.bonCommandeItemSubject.subscribe(
      (data)=>{
        this.bonCommandesItems = data;
      }
    );
      
  }
  changement(){
    this.tva = this.fournisseurs.find(e=>e.name==this.fournisseur)['tva'];
  }

  reset(){
    this.listproduits=[];
    this.bill_price=0;
    this.fournisseur='';
  }

  openPDF(){
    let DATA = document.getElementById('test'); 
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 192;
        let fileHeight = canvas.height * fileWidth / canvas.width;
         const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 25;
        PDF.addImage(FILEURI, 'PNG', 10, position, fileWidth, fileHeight)
        PDF.save('{{ date }}');
    }); 
    }

    updateList(){
      let p=false;
      for(let i=0; i<this.listproduits.length; i++){ 
        if(this.listproduits[i].product==this.product){
          p=true; 
          this.listproduits[i].quantity = this.quantity;
          this.listproduits[i].unit_price = this.unit_price;
          this.listproduits[i].total_price = this.quantity * this.unit_price;
          this.htc_price = 0;
          for(let i=0; i<this.listproduits.length; i++){ 
            this.htc_price +=  this.listproduits[i].total_price; 
          }
          this.tva_price = (this.htc_price * this.tva)/100;
          this.bill_price = this.tva_price + this.htc_price;
          break;}
        }
      if(!p){
        let item = {
          product: this.product,
          quantity: this.quantity,
          unit_price: this.unit_price,
          total_price: this.quantity * this.unit_price
        }
        this.listproduits.push(item);
        this.htc_price = 0;
        for(let i=0; i<this.listproduits.length; i++){ this.htc_price += this.listproduits[i].total_price;}
        this.tva_price = (this.htc_price * this.tva)/100;
        this.bill_price = this.tva_price + this.htc_price;
      }
    }
    
    
    focusItem(index){
      this.product = this.listproduits[index].product;
      this.quantity = this.listproduits[index].quantity;
      this.unit_price = this.listproduits[index].unit_price;
    }
    
    deleteItem(index){
      this.listproduits.splice(1, index);
    }

    addBonCommande(){
      this.reapprovService.addBonCommande({
        fournisseur: this.fournisseur,
        ligne_budget: this.ligne_budget,
        listproduits: this.listproduits,
        amount_bill: this.bill_price
      });
    }

    infoBonCommande(data){
      if( data.cgaiDecision && data.dgDecision && this.role=='rmg'){
        this.printable = true;
      }
      this.id = data.id;
      this.fournisseur = data.fournisseur;
      this.ligne_budget = data.ligne_budget;
      this.date = data.instant;
      this.numero_piece = data.numero_piece;
      this.listproduits = this.bonCommandesItems.filter(e=>e.bon_commande==data.id);
      this.htc_price=0;
      this.file = this.files.filter(e=>e.bon_commande == data.id);
      for(let i=0; i<this.listproduits.length; i++){
        this.listproduits[i]['total_price'] = this.listproduits[i].quantity * this.listproduits[i].unit_price ;
        this.htc_price += this.listproduits[i]['total_price'] ;
      }
      this.tva_price = (this.htc_price * this.fournisseurs.find(e=>e.name==data.fournisseur)['tva'])/100;
      this.bill_price = this.tva_price + this.htc_price;
      this.montant_en_lettre = NumberToLetter(this.bill_price);
    }

    cancelBonCommande(id){ this.reapprovService.cancelBonCommande(id);} 

    decisionBonCommande(decision){ 
      if(decision=='valider'){this.reapprovService.decisionBonCommande({id: this.id, role: this.role, decision: true});}
      else{this.reapprovService.decisionBonCommande({id: this.id, role: this.role, decision: false});}
    }

    upload(e){
      let file = new FormData();
      let data;
      let date = new Date();
      for ( let i=0; i<e.target.files.length; i++){
        data = ((e.target.files[i]).name).split('.')
        file.append('file'+i, e.target.files[i], data[0]+'_'+date.getDate()+'_'+date.getMonth()+'_'+date.getUTCFullYear()+'.'+data[1]);
      }
      this.reapprovService.addFileToBon(file, this.id);
    }

    deleteFile(id){
      this.reapprovService.deleteFile(id);
    }

    getFile(id){
      this.reapprovService.getFile(id);
    }

    confirmBonCommande(id){
      this.reapprovService.confirmBC(id);
    }


}
