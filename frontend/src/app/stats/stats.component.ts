import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
declare  var jQuery:  any;
import jsPDF from 'jspdf';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import htmlToPdfmake from 'html-to-pdfmake';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  listproduits=[];
  products=["Ardoise", "Formats", "Cisceaux", "Ancre", "Cable"];
  @Input() product;
  @Input() unit_price;
  @Input() quantity;
  @Input() bill_price = 0;
  @Input() fournisseur;
  @ViewChild('bondecommande') bondecommande:ElementRef;
  @ViewChild('report_bondecommande1') report_bondecommande1:ElementRef;
  constructor(private http: HttpClient) { }
  ngOnInit() { }


  public openPDF():void {
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

  }
  
  


  

