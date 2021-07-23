import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
//declare  var jQuery:  any;
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
//import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';
import { ProduitsService } from '../_services/produits.service';
import { environment } from 'src/environments/environment';
import { ReapprovsService } from '../_services/reapprovs.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reapprov',
  templateUrl: './reapprov.component.html',
  styleUrls: ['./reapprov.component.css']
})
export class ReapprovComponent implements OnInit {

  listproduits=[];
  produits=[];
  services=[];
  fournisseurs=[];
  ligne_budgets = [];
  @Input() product;
  @Input() unit_price;
  @Input() quantity;
  @Input() bill_price = 0;
  @Input() fournisseur;
  @Input() ligne_budget;
  @Input() bonCommandes=[];
  @Input() bonCommandesItems=[];
  bonCommandeSubscription: Subscription;
  bonCommandeItemSubscription: Subscription;
  
  @ViewChild('bondecommande') bondecommande:ElementRef;
  @ViewChild('report_bondecommande1') report_bondecommande1:ElementRef;
  
  constructor(private httpClient: HttpClient, private produitService: ProduitsService, private reapprovService: ReapprovsService) { }
  ngOnInit() { 
    this.reapprovService.listBonCommande();
    this.reapprovService.listBonCommandeItem();
    this.bonCommandeSubscription = this.reapprovService.bonCommandeSubject.subscribe(
      (data)=>{
        this.bonCommandes = data;
      }
    );

    this.bonCommandeItemSubscription = this.reapprovService.bonCommandeItemSubject.subscribe(
      (data)=>{
        this.bonCommandesItems = data;
      }
    );

    this.httpClient.get(environment.url + "listproduits")
      .subscribe(
        (data: any[])=>{
          this.produits = data;
          console.log("reussite lors de la récuperation des produits");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des produits");
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

    this.httpClient.get(environment.url + "listService")
      .subscribe(
        (data: any[])=>{
          this.services = data;
          console.log("reussite lors de la récuperation des services");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des services");
        }
      );

    this.httpClient.get(environment.url + "listService")
    .subscribe(
      (data: any[])=>{
        this.services = data;
        console.log("reussite lors de la récuperation des lignes budgetaires");
      },
      (error)=>{
        console.log("erreur lors de la récuperation des lignes budgetaires");
      }
    );

    this.httpClient.get(environment.url+"allLigneInvestissement/").subscribe(
      (data: any[])=>{
         for (let i=0; i<data.length; i++){ this.ligne_budgets.push(data[i]) ;}
       }
    );
    this.httpClient.get(environment.url+"allLigneFonctionnement/").subscribe(
      (data: any[])=>{
        for (let i=0; i<data.length; i++){ this.ligne_budgets.push(data[i]) ;}
      }
    );
  }


  openPDF(){
    let DATA = document.getElementById('bondecommande'); 
    html2canvas(DATA).then(canvas => {
        
        let fileWidth = 208;
        let fileHeight = canvas.height * fileWidth / canvas.width;
        const FILEURI = canvas.toDataURL('image/png');
        let PDF = new jsPDF('p', 'mm', 'a4');
        let position = 0;
        PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight)
        PDF.save('angular-demo.pdf');
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
          this.bill_price = 0;
          for(let i=0; i<this.listproduits.length; i++){ this.bill_price = this.bill_price + this.listproduits[i].total_price;}
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
        this.bill_price = 0;
        for(let i=0; i<this.listproduits.length; i++){ this.bill_price = this.bill_price + this.listproduits[i].total_price;}
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
        listproduits: this.listproduits
      });
    }


}
