import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  p: Boolean;
  headers = new HttpHeaders().set('Authorization', 'Bearer '+window.localStorage.getItem("token"));

  constructor(private httpClient: HttpClient) { }

  produitsSubject = new Subject<any[]>();

  produits=[];
  produitsFilter;

  emitProduitsSubject(){
    this.produitsSubject.next(this.produits.slice());
  }

  listProduits(){
    this.httpClient.get(environment.url + "listproduits", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.produits = data;
          this.emitProduitsSubject();
          console.log("reussite lors de la récuperation des produits");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des produits");
        }
      );
  }

  addProduit(produits){
    this.httpClient.post<any[]>(environment.url + "addproduit/", produits, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listProduits();
          console.log("Réussite lors de l ajout de produit");
        },
        (error)=>{
          console.log("Erreur lors de l ajout de produit");
        }
      );
  }

  updateProduit(produit){
    this.httpClient.post<any[]>(environment.url + "updateproduit/", produit, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listProduits();
          console.log("Réussite lors de la modification d un produit");
        },
        (error)=>{
          console.log("Erreur lors de la modification d un produit");
        }
      );
  }

  deleteProduit(id){
    this.p = confirm("Voulez-vous vraiment supprimer ?");
    if(this.p){
      this.httpClient.post<any[]>(environment.url + "deleteproduit/",{index: id}, {'headers':this.headers})
        .subscribe(
          (data)=>{
            this.listProduits();
            console.log("Réussite lors de la suppression d un produit");
          },
          (error)=>{
            console.log("Erreur lors de la suppression d un produit");
          }
        );
    }

  }

}
