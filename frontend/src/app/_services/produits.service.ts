import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProduitsService {
  p: Boolean;

  constructor(private httpClient: HttpClient) { }

  produitsSubject = new Subject<any[]>();
  fournisseursSubject = new Subject<any[]>();
  servicesSubject = new Subject<any[]>();
  produits: any[];
  produitsFilter;
  fournisseurs: any[];
  services: any[];

  emitProduitsSubject(){ this.produitsSubject.next(this.produits.slice()); }
  emitFournisseurSubject(){this.fournisseursSubject.next(this.fournisseurs.slice());}
  emitServiceSubject(){this.servicesSubject.next(this.services.slice());}

  listProduits(){
    this.httpClient.get(environment.url + "listproduits")
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
    this.httpClient.post<any[]>(environment.url + "addproduit/", produits)
      .subscribe(
        (data)=>{
          this.listProduits();
          console.log("Réussite lors de l ajout de produit" + data["message"]);
        },
        (error)=>{
          console.log("Erreur lors de l ajout de produit");
        }
      );
  }

  updateProduit(produit){
    this.httpClient.post<any[]>(environment.url + "updateproduit/", produit)
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
      this.httpClient.post<any[]>(environment.url + "deleteproduit/",{id: id})
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

  addFournisseur(fournisseur){
    this.httpClient.post(environment.url+'addFournisseur/', fournisseur).subscribe(
      (data)=>{
        this.listFournisseurs();
        console.log("Réussite lors de l ajout de fournisseur");
      },
      (error)=>{}
    );
  }
  listFournisseurs(){
    this.httpClient.get(environment.url+'listFournisseur').subscribe(
      (data: any[])=>{
        this.fournisseurs = data;
        this.emitFournisseurSubject();
        console.log("Réussite lors de la recuperation des fournisseurs");
      },
      (error)=>{
        console.log("erreur lors de la récuperation des fournisseurs");
      }
    );
  }
  editFournisseur(fournisseur){
    this.httpClient.post(environment.url+'updateFournisseur/', fournisseur).subscribe(
      (data)=>{
        this.listFournisseurs();
        console.log("Réussite lors de la modification d un fournisseur");
      },
      (error)=>{
        console.log("Erreur lors de la modification d un fournisseur");
      }
    );
  }
  deleteFournisseur(id){
    this.p = confirm("Voulez-vous vraiment supprimer ?");
    if(this.p){
      this.httpClient.post<any[]>(environment.url + "deleteFournisseur/",{id: id})
        .subscribe(
          (data)=>{
            this.listFournisseurs();
            console.log("Réussite lors de la suppression d un fournisseur");
          },
          (error)=>{
            console.log("Erreur lors de la suppression d un fournisseur");
          }
        );
    }
  }


  listServices(){
    this.httpClient.get(environment.url + "listService")
      .subscribe(
        (data: any[])=>{
          this.services = data;
          this.emitServiceSubject();
          console.log("reussite lors de la récuperation des services");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des services");
        }
      );
  }

  addService(services){
    this.httpClient.post<any[]>(environment.url + "addService/", services)
      .subscribe(
        (data)=>{
          this.listServices();
          console.log("Réussite lors de l ajout de service");
        },
        (error)=>{
          console.log("Erreur lors de l ajout de service");
        }
      );
  }

  updateService(service){
    this.httpClient.post<any[]>(environment.url + "updateService/", service)
      .subscribe(
        (data)=>{
          this.listServices();
          console.log("Réussite lors de la modification d un service");
        },
        (error)=>{
          console.log("Erreur lors de la modification d un service");
        }
      );
  }

  deleteService(id){
    this.p = confirm("Voulez-vous vraiment supprimer ?");
    if(this.p){
      this.httpClient.post<any[]>(environment.url + "deleteService/",{id: id})
        .subscribe(
          (data)=>{
            this.listServices();
            console.log("Réussite lors de la suppression d un service");
          },
          (error)=>{
            console.log("Erreur lors de la suppression d un service");
          }
        );
    }

  }

}
