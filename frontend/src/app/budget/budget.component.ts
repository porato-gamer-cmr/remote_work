import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';

import { BudgetsService } from '../_services/budgets.service';
declare  var jQuery:  any;

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrls: ['./budget.component.css']
})
export class BudgetComponent implements OnInit {

  @Input() posteFraisFonctionnement: any[];
  @Input() posteFraisInvestissement: any[];
  @Input() posteFraisFonctionnement_year: any[];
  @Input() posteFraisInvestissement_year: any[];
  @Input() ligneFraisFonctionnement: any[];
  @Input() ligneFraisInvestissement: any[];
  subscriptionLigneFraisInvestissement: Subscription;
  subscriptionPosteFraisInvestissement: Subscription;
  subscriptionLigneFraisFonctionnement: Subscription;
  subscriptionPosteFraisFonctionnement: Subscription;
  @Input() dataSmart = [1,2,3,4,5,6,7];
  @Input() part0=-1;
  @Input() part1=-1;
  @Input() year0;
  @Input() year1;
  @Input() ligneBudget;
  @Input() nomPoste;
  @Input() montant;
  @Input() typeDeFrais;
  @Input() id;
  yearTab = [2021,2022,2023,2024,2025,2026,2027,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2039,2040,2041,2042,2043,2044,2045,2046,2047,2048,2049,2050];
  @Input() tableauLigneBudget: any[];
  subjectTableauLigneBudget = new Subject<any []>();
  subscriptionTableauLigneBudget: Subscription;
  optionValue = ["bonjou tonton", "bonsoir mama"]
  
  constructor(private budgetService: BudgetsService) { }

  ngOnInit(): void {
  
    this.typeDeFrais = "fonctionnement";
    this.year0 = (new Date()).getFullYear();
    this.year1 = (new Date()).getFullYear();
    this.budgetService.listeLigneFraisFonctionnement();
    this.budgetService.listeLigneFraisInvestissement();
    this.budgetService.listePosteFraisInvestissement();
    this.budgetService.listePosteFraisFonctionnement();
    this.subscriptionLigneFraisFonctionnement = this.budgetService.subjectLigneFraisFonctionnement.subscribe(
      (data)=>{
        this.ligneFraisFonctionnement=data;
      }
      );

    this.subscriptionLigneFraisInvestissement = this.budgetService.subjectLigneFraisInvestissement.subscribe(
      (data)=>{
        this.ligneFraisInvestissement=data;
      }
      );
      
    this.subscriptionPosteFraisFonctionnement = this.budgetService.subjectPosteFraisFonctionnement.subscribe(
      (data)=>{
        this.posteFraisFonctionnement=data;
        this.posteFraisFonctionnement_year = this.posteFraisFonctionnement.filter(item => item.year==this.year0);
      }
      );

    this.subscriptionPosteFraisInvestissement = this.budgetService.subjectPosteFraisInvestissement.subscribe(
      (data)=>{
        this.posteFraisInvestissement=data;
        this.posteFraisInvestissement_year = this.posteFraisInvestissement.filter(item => item.year==this.year1);
      }
      );

    this.subscriptionTableauLigneBudget = this.subjectTableauLigneBudget.subscribe(
      (data)=>{this.tableauLigneBudget=data;}
    );

     
  }
  
  changeTypeDeFrais(type){ this.typeDeFrais = type; }

  reset(){
    this.tableauLigneBudget = [];
  }

  updateVisibility(index){
      if(this.typeDeFrais == "fonctionnement" && this.part0 != index){
        this.part0 = index;
        this.tableauLigneBudget = this.ligneFraisFonctionnement.filter(item=> item.poste == this.posteFraisFonctionnement_year[index].id);
        this.subjectTableauLigneBudget.next(this.tableauLigneBudget.slice());
      }
      else if(this.typeDeFrais == "investissement" && this.part1 != index){
        this.part1 = index;
        this.tableauLigneBudget = this.ligneFraisInvestissement.filter(item=> item.poste == this.posteFraisInvestissement_year[index].id);
        this.subjectTableauLigneBudget.next(this.tableauLigneBudget.slice());
      }
      else{
        this.part0 = -1; 
        this.part1 = -1;
      }
  }

  refreshPoste(type){
  
    if(type == "fonctionnement"){
      this.posteFraisFonctionnement_year = this.posteFraisFonctionnement.filter(item => item.year==this.year0);
      this.part0 = -1; 
      this.part1 = -1;
    }
    else{
      this.posteFraisInvestissement_year = this.posteFraisInvestissement.filter(item => item.year==this.year1);
      this.part0 = -1; 
      this.part1 = -1;
    }
    
  }

  add(){
    let p = true;
    /** find if the element already exist and edit the amount if true */
    for(let i=0 ; i<this.tableauLigneBudget.length; i++){
      if(this.tableauLigneBudget[i].name == this.ligneBudget && this.montant){
        this.tableauLigneBudget[i].amount = this.montant;
        p = false;
        break;
      }
      
    }
    /** add the new element if not exist in the tab */
    if(p && this.montant && this.ligneBudget){
      this.tableauLigneBudget.push({name: this.ligneBudget, amount: this.montant});
    }
    
  }

  editer(index){
    this.ligneBudget = this.tableauLigneBudget[index].name;
    this.montant = this.tableauLigneBudget[index].amount;
  }
  delete(index){
    this.tableauLigneBudget.splice(index,1);
  }

  nouveauPoste(form: NgForm){
    if(this.typeDeFrais="fonctionnement"){
      let poste ={
        name: form.value.name,
        type: this.typeDeFrais,
        year: this.year0,
        ligne: this.tableauLigneBudget
      }
      this.budgetService.nouveauPosteBudget(poste, this.typeDeFrais);
    }
    else{
      let poste ={
        name: form.value.name,
        type: this.typeDeFrais,
        year: this.year1,
        ligne: this.tableauLigneBudget
      }
      this.budgetService.nouveauPosteBudget(poste, this.typeDeFrais);
    }
    
    this.closeModal();
  }

  editPoste(form: NgForm){
    let poste ={
      name: form.value.name ? form.value.name : this.nomPoste,
      id: this.id,
      ligne: this.tableauLigneBudget
    }
    this.budgetService.editPosteBudget(poste, this.typeDeFrais);
    this.closeModal();
  }

  closeModal(){
    (function ($) {
      $(document).ready(function(){
        $('.modal').modal('hide');
      });
    })(jQuery);
  }

  updateData(poste){
    this.nomPoste = poste.name;
    this.id = poste.id;
    if(this.typeDeFrais == "investissement"){
      this.tableauLigneBudget = this.ligneFraisInvestissement.filter(item => item.poste==poste.id);
    }else{
      this.tableauLigneBudget = this.ligneFraisFonctionnement.filter(item => item.poste==poste.id);
    }
  }

}
