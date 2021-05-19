import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketApprovService {

  headers = new HttpHeaders().set('Authorization', 'Bearer '+window.localStorage.getItem("token"));

  constructor(private httpClient: HttpClient) { }

  ticketApprovsSubject = new Subject<any[]>();
  ticketApprovsItemsSubject = new Subject<any[]>();
  personnalTicketApprovsSubject = new Subject<any[]>();
  ticketApprovs=[];
  ticketApprovsItems=[];
  personnalTicketApprovs=[];


  emitTicketApprovsSubject(){
    this.ticketApprovsSubject.next(this.ticketApprovs.slice());
  }
  emitPersonnalTicketApprovsSubject(){
    this.personnalTicketApprovsSubject.next(this.personnalTicketApprovs.slice());
  }
  emitTicketApprovsItemsSubject(){
    this.ticketApprovsItemsSubject.next(this.ticketApprovsItems.slice());
  }
  

  listTicketApprovsItems(){
    this.httpClient.get(environment.url + "listapprovsticketitems", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.ticketApprovsItems = data;
          this.emitTicketApprovsItemsSubject();
          console.log("reussite lors de la récuperation des items tickets approvs");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des items tickets approvs");
        }
      );
  }

  listTicketApprovs(){
    this.httpClient.get(environment.url + "listapprovsticket", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.ticketApprovs = data;
          this.emitTicketApprovsSubject();
          console.log("reussite lors de la récuperation des tickets approvs");
          this.listTicketApprovsItems();
        },
        (error)=>{
          console.log("erreur lors de la récuperation des tickets approvs");
        }
      );
  }

  listPersonnalTicketApprovs(){
    this.httpClient.get(environment.url + "personnalapprovsticket", {'headers':this.headers})
      .subscribe(
        (data: any[])=>{
          this.personnalTicketApprovs = data;
          this.emitPersonnalTicketApprovsSubject();
          console.log("reussite lors de la récuperation des tickets personnels approvs");
        },
        (error)=>{
          console.log("erreur lors de la récuperation des tickets personnels approvs");
        }
      );
  }

  addApprovTicket(approv){
    this.httpClient.post<any[]>(environment.url + "addapprovticket/", approv, {'headers':this.headers})
      .subscribe(
        (data)=>{
           this.listTicketApprovs();
           this.listPersonnalTicketApprovs();
           this.listTicketApprovsItems();
           console.log("Réussite lors de l ajout de ticket approv");
        },
        (error)=>{
          console.log(error);
        }
      );
  }

  deleteApprovTicket(id){
    this.httpClient.post<any[]>(environment.url + "deleteapprovticket/", {"id":id}, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listTicketApprovs();
          this.listPersonnalTicketApprovs();
          this.listTicketApprovsItems();
          console.log("Réussite lors de la suppression ticket approv");
        },
        (error)=>{
          console.log("Erreur lors de la suppression ticket approv");
        }
      );
  }


  modifTicketApprovs(approv){
    this.httpClient.post<any[]>(environment.url + "modifapprovticket/", approv, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listTicketApprovs();
          this.listPersonnalTicketApprovs();
          this.listTicketApprovsItems();
          console.log("reussite lors de la modification de ticket approv")
        },
        (error)=>{
          console.log("Erreur lors de la modification de ticket approv");
        }
      );
  }

  decision(decision, id, message){
    let value={
      decision: parseInt(decision),
      id: id, 
      message: message
    }
    this.httpClient.post<any[]>(environment.url + "decisionapprovticket/", value, {'headers':this.headers})
      .subscribe(
        (data)=>{
          this.listPersonnalTicketApprovs();
           console.log("reussite de la décision ticket approv")
        },
        (error)=>{
          console.log("Erreur lors de la décision ticket approv");
        }
      );
  }

}
