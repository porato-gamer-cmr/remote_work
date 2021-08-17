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
  files: any[];
  bonCommandeSubject = new Subject<any[]>();
  bonCommandeItemSubject = new Subject<any[]>();
  filesSubject = new Subject<any[]>();

  constructor(private httpClient: HttpClient) { }

  emitBonCommande(){this.bonCommandeSubject.next(this.bonCommande.slice());}
  emitBonCommandeItem(){this.bonCommandeItemSubject.next(this.bonCommandeItem.slice());}
  emitFiles(){this.filesSubject.next(this.files.slice());}


  addBonCommande(commande){
    this.httpClient.post(environment.url+'addBonCommande/', commande).subscribe(
      (data)=>{
        this.listBonCommande();
        this.listBonCommandeItem();
        console.log('Réussite lors de l ajout de bon de commande');
      },
      (error)=>{}
    );
  }
  listBonCommande(){
    this.httpClient.get(environment.url+'listBonCommande/').subscribe(
      (data: any[])=>{
        this.bonCommande = data;
        this.emitBonCommande()
        console.log('Réussite lors de la recupération des bon de commande')
      },
      (error)=>{}
    );
  }
  editBonCommande(commande){
    this.httpClient.post(environment.url+'editBonCommande/', commande).subscribe(
      (data)=>{
        this.listBonCommande();
        console.log('Réussite lors de la modification de bon de commande')
      },
      (error)=>{}
    );
  }
  deleteBonCommande(id){
    this.httpClient.post(environment.url+'deleteBonCommande/', id).subscribe(
      (data)=>{
        this.listBonCommande();
        console.log('Réussite lors de la suppression des bon de commande')
      },
      (error)=>{}
    );
  }

  listBonCommandeItem(){
    this.httpClient.get(environment.url+'listBonCommandeItem/').subscribe(
      (data:any[])=>{
        this.bonCommandeItem = data;
        this.emitBonCommandeItem();
        console.log('Réussite lors de la recupération des bon de commandeItem')
      },
      (error)=>{}
    );
  }

  cancelBonCommande(id){
    this.httpClient.post(environment.url+'cancelBonCommande/', id).subscribe(
      (data)=>{
        this.listBonCommande();
      }
    );
  }

  confirmBC(id){
    this.httpClient.post(environment.url+'confirmBC/', id).subscribe(
      (data)=>{
        this.listBonCommande();
      }
    );
  }

  decisionBonCommande(data){
    this.httpClient.get(environment.url+'decisionBonCommande/').subscribe(
      (data)=>{
        this.listBonCommande();
      }
    );
  }

  addFileToBon(file, id){
    this.httpClient.post(environment.url+'upload/', file).subscribe(
      (data)=>{
        if(data){
          this.httpClient.post(environment.url+'linkFileToBon/', {bon_commande: id, id: data}).subscribe(
            (data)=>{
              this.allFile();
              console.log("good")},
            (error)=>{console.log("bad")}
          );
        }
      }
    );
  }

  allFile(){
    this.httpClient.get(environment.url+'allFile').subscribe(
      (data: any[])=>{
        this.files = data;
        this.emitFiles();
        console.log('Réussite lors de la recuperation des fichiers')
      }
    );
  }

  deleteFile(id){
    this.httpClient.post(environment.url+'deleteFile/', id).subscribe(
      (data: any[])=>{
        this.allFile();
        console.log('Réussite lors de la suppression d un fichier')
      }
    );
  }

  getFile(id){
    this.httpClient.post(environment.url+'getFile/', id).subscribe(
      (data: any[])=>{
        console.log(data)
        console.log('Réussite lors de l envoi d un fichier')
      }
    );
  }
}
