import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApprovsService {

  p: Boolean;
  headers = new HttpHeaders().set('Authorization', 'Bearer '+window.localStorage.getItem("token"));

  constructor(private httpClient: HttpClient) { }

  approvsSubject = new Subject<any[]>();
  approvsItemsSubject = new Subject<any[]>();
  specialApprovsSubject = new Subject<any[]>();
  inferiorApprovsSubject = new Subject<any[]>();
  approvstatsSubject = new Subject<any[]>();
  approvs=[];
  approvsItems=[];
  specialApprovs=[];
  inferiorApprovs=[];
  approvStats;


  emitApprovsSubject(){
    this.approvsSubject.next(this.approvs.slice());
  }
  emitApprovsItemsSubject(){
    this.approvsItemsSubject.next(this.approvsItems.slice());
  }
  emitSpecialApprovsSubject(){
    this.specialApprovsSubject.next(this.specialApprovs.slice());
  }
  emitInferiorApprovsSubject(){
    this.inferiorApprovsSubject.next(this.inferiorApprovs.slice());
  }

  listApprovsItems(){
    this.httpClient.get(environment.url + "listapprovsitems", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.approvsItems = data;
          this.emitApprovsItemsSubject();
          console.log("reussite lors de la récuperation des items d'approvs");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des items d'approvs");
        }
      );
  }

  listApprovs(){
    this.httpClient.get(environment.url + "listapprovs", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.approvs = data;
          this.emitApprovsSubject();
          console.log("reussite lors de la récuperation des approvs"+ data);
          this.listApprovsItems();
        },
        (error)=>{
          console.log("erreur lors de la récuperation des approvs" + error);
        }
      );
  }

  listSpecialApprovs(){
    this.httpClient.get(environment.url + "specialapprovs", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.specialApprovs = data;
          this.emitSpecialApprovsSubject();
          console.log("reussite lors de la récuperation des approvs spécial");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des approvs spécial" + error);
        }
      );
  }

  listInferiorApprovs(){
    this.httpClient.get(environment.url + "listinferiorapprovs", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.inferiorApprovs = data;
          this.emitInferiorApprovsSubject();
          console.log("reussite lors de la récuperation des approvs d'inferieurs");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des approvs d'inferieurs" + error);
        }
      );
  }

  addApprov(approv){
    this.httpClient.post<any[]>(environment.url + "addapprov/", approv, {'headers':this.headers})
      .subscribe(
        (data)=>{
           this.listApprovs();
           this.listApprovsItems();
           this.listInferiorApprovs();
           this.listSpecialApprovs();
           this.getApprovStats();
           console.log("Réussite lors de l ajout d approv");
        },
        (error)=>{
          console.log("Erreur lors de l ajout d approv"+ error);
        }
      );
  }

  deleteApprov(id){
    this.p = confirm("Voulez-vous vraiment supprimer ?");
    if(this.p){
      this.httpClient.post<any[]>(environment.url + "deleteapprov/", {"id":id}, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listApprovs();
          this.listApprovsItems();
          this.listInferiorApprovs();
          this.listSpecialApprovs();
          this.getApprovStats();
          console.log("Réussite lors de la suppression d approv");
        },
        (error)=>{
          console.log("Erreur lors de la suppression d approv"+ error);
        }
      );
    }
  }


  lockApprov(id){
    this.p = confirm("Voulez-vous vraiment fermer ce ticket ?");
    if(this.p){
      this.httpClient.post<any[]>(environment.url + "lockapprov/", {"id":id}, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listApprovs();
          this.listApprovsItems();
          this.listInferiorApprovs();
          this.listSpecialApprovs();
          this.getApprovStats();
          console.log("Réussite lors de la fermeture d un approv");
        },
        (error)=>{
          console.log("Erreur lors de la fermeture d un approv");
        }
      );
    }
  }


  modifApprovs(approv){
    this.httpClient.post<any[]>(environment.url + "modifapprov/", approv, {'headers':this.headers})
      .subscribe(
        (data)=>{
           this.listApprovs();
           this.getApprovStats();
           console.log("reussite lors de la modification de l approv")
        },
        (error)=>{
          console.log("Erreur lors de la modification de l approv"+ error);
        }
      );
  }

  decision(decision, id, message, role){
    let value={
      decision: parseInt(decision),
      id: id, 
      message: message,
      role: role
    }
    this.httpClient.post<any[]>(environment.url + "decisionapprov/", value, {'headers':this.headers})
      .subscribe(
        (data)=>{
           this.listApprovs();
           this.listInferiorApprovs();
           this.listSpecialApprovs();
           this.getApprovStats();
           console.log("reussite de la prise de décision")
        },
        (error)=>{
          console.log("Erreur la prise de décision");
        }
      );
  }


  getApprovStats(){
    this.httpClient.get<any[]>(environment.url + "approvstats/", {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.approvStats = data;
          this.approvstatsSubject.next(this.approvStats)
           console.log("reussite de la prise de statistique approv")
        },
        (error)=>{
          console.log("Erreur la prise de statistique approv");
        }
      );
  }

  
  
}
