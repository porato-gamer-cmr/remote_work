import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  posteFraisFonctionnement: any[];
  posteFraisInvestissement: any[];
  ligneFraisFonctionnement: any[];
  ligneFraisInvestissement: any[];
  subjectLigneFraisInvestissement = new Subject<any[]>();
  subjectPosteFraisInvestissement = new Subject<any[]>();
  subjectLigneFraisFonctionnement = new Subject<any[]>();
  subjectPosteFraisFonctionnement = new Subject<any[]>();

  constructor(private httpClient: HttpClient) { }

  emitPosteFraisFonctionnement(){
    this.subjectPosteFraisFonctionnement.next(this.posteFraisFonctionnement.slice());
  }
  emitLigneFraisFonctionnement(){
    this.subjectLigneFraisFonctionnement.next(this.ligneFraisFonctionnement.slice());
  }
  emitPosteFraisInvestissment(){
    this.subjectPosteFraisInvestissement.next(this.posteFraisInvestissement.slice());
  }
  emitLigneFraisInvestissement(){
    this.subjectLigneFraisInvestissement.next(this.ligneFraisInvestissement.slice());
  }

  listePosteFraisFonctionnement(){
    this.httpClient.get(environment.url+"allPosteFonctionnement/").subscribe(
      (data: any[])=>{
        this.posteFraisFonctionnement = data;
        this.emitPosteFraisFonctionnement();
      }
    );
  }
  listeLigneFraisFonctionnement(){
    this.httpClient.get(environment.url+"allLigneFonctionnement/").subscribe(
      (data: any[])=>{
        this.ligneFraisFonctionnement = data;
        this.emitLigneFraisFonctionnement();
      }
    );
  }
  listePosteFraisInvestissement(){
    this.httpClient.get(environment.url+"allPosteInvestissement/").subscribe(
      (data: any[])=>{
        this.posteFraisInvestissement = data;
        this.emitPosteFraisInvestissment();
      }
    );
  }
  listeLigneFraisInvestissement(){
    this.httpClient.get(environment.url+"allLigneInvestissement/").subscribe(
      (data: any[])=>{
        this.ligneFraisInvestissement = data;
        this.emitLigneFraisInvestissement();
      }
    );
  }

  nouveauPosteBudget(poste, type){
    this.httpClient.post(environment.url+"newPoste/", poste).subscribe(
      (data)=>{},
      (error)=>{}
    );
    if(type=="investissement"){
      this.listePosteFraisInvestissement();
      this.listeLigneFraisInvestissement();
    }else{
      this.listePosteFraisFonctionnement();
      this.listeLigneFraisFonctionnement();
    }
  }


  editPosteBudget(poste, type){
    this.httpClient.post(environment.url+"editPoste/", poste).subscribe(
      (data)=>{}
    );
    if(type=="investissement"){
      this.listePosteFraisInvestissement();
      this.listeLigneFraisInvestissement();
    }else{
      this.listePosteFraisFonctionnement();
      this.listeLigneFraisFonctionnement();
    }
  }


}
