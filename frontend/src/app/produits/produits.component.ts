import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProduitsService } from '../services/produits.service';
declare  var jQuery:  any;
@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit, OnDestroy {

  produits;
  produitsFilter: any[];
  produitsSubscription: Subscription;
  produitsFilterSubscription: Subscription;
  @Input() name;
  @Input() quantity;
  @Input() security;
  @Input() warning;
  @Input() type;
  @Input() id;
  @Input() e;
  @Input() index;
  p: Boolean;

  constructor(private produitsService: ProduitsService) { }

  ngOnInit(){
    this.produitsService.listProduits();
    this.produitsSubscription = this.produitsService.produitsSubject.subscribe(
      (data: any[])=>{
        this.produits = data; this.produitsFilter = this.produits;
      }
    );
   
    
  }

  infoProduits(produits){
    this.id = produits.id;
    this.name = produits.name;
    this.quantity = produits.quantity;
    this.security = produits.security;
    this.warning = produits.warning;
    this.type = produits.type
  }

  updateProduit(form: NgForm){
    let produitEdit = {
      id: this.id,
      name: (form.value.name) ? form.value.name : this.name,
      quantity: (form.value.quantity) ? form.value.quantity : this.quantity,
      security: (form.value.security) ? form.value.security : this.security,
      warning: (form.value.warning) ? form.value.warning : this.warning,
      type: (form.value.type) ? form.value.type : this.type
    };

    this.produitsService.updateProduit(produitEdit);
    this.produitsService.emitProduitsSubject();
    this.closeModal();

  }

  closeModal(){
    (function ($) {
      $(document).ready(function(){
        $('.modal').modal('hide');
      });
    })(jQuery);
  }

  deleteProduit(id){
    this.produitsService.deleteProduit(id);
    this.produitsService.emitProduitsSubject();
  }

  addProduit(form: NgForm){
    let produit = {
      name: form.value.name,
      quantity: form.value.quantity,
      security: form.value.security,
      warning: form.value.warning,
      type: form.value.type

    };
    this.produitsService.addProduit(produit);
    this.closeModal();

  }

  searchProduit(){
    this.produitsFilter = [];
    if(!this.e){this.e="";}
    p: RegExp("  ","g");
    this.e=this.e.replace(this.p," ");
    this.e=this.e.toLowerCase();
    for(let produit of this.produits){
      this.p=false;
      if(String(produit.name).toLowerCase().search(this.e)!=-1){
        this.p=true;
      }
      if(this.p){
        this.produitsFilter.push(produit);
      }
    }    
  }

  ngOnDestroy(){
    this.produitsSubscription.unsubscribe();
  }

}
