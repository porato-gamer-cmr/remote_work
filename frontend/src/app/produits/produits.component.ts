import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ProduitsService } from '../_services/produits.service';
declare  var jQuery:  any;
@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit, OnDestroy {

  services=[];
  fournisseurs=[];
  produits=[];
  produitsFilter=[];
  produitsSubscription: Subscription;
  produitsFilterSubscription: Subscription;
  servicesSubscription: Subscription;
  fournisseursSubscription: Subscription;
  //common input
  @Input() name;
  @Input() id;
  @Input() numero_compte;
  //product input
  @Input() quantity;
  @Input() security;
  @Input() warning;
  @Input() type;
  //fournisseur input
  @Input() numero_tier;
  @Input() tva;
  //other input
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
    this.produitsService.listServices();
    this.servicesSubscription = this.produitsService.servicesSubject.subscribe(
      (data: any[])=>{
        this.services = data; 
      }
    );
    this.produitsService.listFournisseurs();
    this.fournisseursSubscription = this.produitsService.fournisseursSubject.subscribe(
      (data: any[])=>{
        this.fournisseurs = data;
      }
    );
  }

  infoProduits(produits){
    this.id = produits.id;
    this.name = produits.name;
    this.quantity = produits.quantity;
    this.security = produits.security;
    this.warning = produits.warning;
    this.type = produits.type,
    this.numero_compte = produits.numero_compte
  }
  infoFournisseurs(fournisseur){
    this.id = fournisseur.id;
    this.name = fournisseur.name;
    this.numero_compte = fournisseur.numero_compte;
    this.numero_tier = fournisseur.numero_tier;
    this.tva = fournisseur.tva
  }
  infoServices(service){
    this.id = service.id;
    this.name = service.name;
    this.numero_compte = service.numero_compte;
  }

  updateProduit(form: NgForm){
    let produitEdit = {
      id: this.id,
      name: (form.value.name) ? form.value.name : this.name,
      quantity: (form.value.quantity) ? form.value.quantity : this.quantity,
      security: (form.value.security) ? form.value.security : this.security,
      warning: (form.value.warning) ? form.value.warning : this.warning,
      type: (form.value.type) ? form.value.type : this.type,
      numero_compte: (form.value.numero_compte) ? form.value.numero_compte : this.numero_compte
    };
    this.produitsService.updateProduit(produitEdit);
    this.closeModal();

  }

  updateService(form: NgForm){
    let serviceEdit = {
      id: this.id,
      name: (form.value.name) ? form.value.name : this.name,
      numero_compte: (form.value.numero_compte) ? form.value.numero_compte : this.numero_compte
    };
    this.produitsService.updateService(serviceEdit);
    this.closeModal();

  }

  updateFournisseur(form: NgForm){
    let fournisseurEdit = {
      id: this.id,
      name: (form.value.name) ? form.value.name : this.name,
      numero_compte: (form.value.numero_compte) ? form.value.numero_compte : this.numero_compte,
      numero_tier: (form.value.numero_tier) ? form.value.numero_tier : this.numero_tier,
      tva: (form.value.tva) ? form.value.tva : this.tva
    };
    this.produitsService.editFournisseur(fournisseurEdit);
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
  }

  deleteFournisseur(id){
    this.produitsService.deleteFournisseur(id);
  }

  deleteService(id){
    this.produitsService.deleteService(id);
  }

  addProduit(form: NgForm){
    let produit = {
      name: form.value.name,
      quantity: form.value.quantity,
      security: form.value.security,
      warning: form.value.warning,
      type: form.value.type,
      numero_compte: (form.value.numero_compte) ? form.value.numero_compte : this.numero_compte
    };
    this.produitsService.addProduit(produit);
    this.closeModal();
  }

  addService(form: NgForm){
    let service = {
      name: form.value.name,
      numero_compte: form.value.numero_compte
    };
    this.produitsService.addService(service);
    this.closeModal();
  }

  addFournisseur(form: NgForm){
    let fournisseur = {
      name: form.value.name,
      numero_compte: form.value.numero_compte,
      numero_tier: form.value.numero_tier,
      tva: form.value.tva,
    };
    this.produitsService.addFournisseur(fournisseur);
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
    this.servicesSubscription.unsubscribe();
    this.fournisseursSubscription.unsubscribe();
  }

}
