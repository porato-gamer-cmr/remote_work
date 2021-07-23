import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReapprovsService {

  bonCommande: any[];
  bonCommandeItem: any[];
  bonCommandeSubject = new Subject<any[]>();
  bonCommandeItemSubject = new Subject<any[]>();

  constructor(private HttpClient: HttpClient) { }

  
  emitBonCommande(){this.bonCommandeSubject.next(this.bonCommande.slice());}
  emitBonCommandeItem(){this.bonCommandeItemSubject.next(this.bonCommandeItem.slice());}


  addBonCommande(commande){
    this.HttpClient.post(environment.url+'addBonCommande/', commande).subscribe(
      (data)=>{
        this.listBonCommande();
        this.listBonCommandeItem();
        
      },
      (error)=>{}
    );
  }
  listBonCommande(){
    this.HttpClient.get(environment.url+'listBonCommande/').subscribe(
      (data: any[])=>{
        this.bonCommande = data;
        this.emitBonCommande
      },
      (error)=>{}
    );
  }
  editBonCommande(commande){
    this.HttpClient.post(environment.url+'editBonCommande/', commande).subscribe(
      (data)=>{
        this.listBonCommande();
      },
      (error)=>{}
    );
  }
  deleteBonCommande(id){
    this.HttpClient.post(environment.url+'deleteBonCommande/', id).subscribe(
      (data)=>{
        this.listBonCommande();
      },
      (error)=>{}
    );
  }

  listBonCommandeItem(){
    this.HttpClient.get(environment.url+'listBonCommandeItem/').subscribe(
      (data:any[])=>{
        this.bonCommandeItem = data;
        this.emitBonCommandeItem();
      },
      (error)=>{}
    );
  }
}
