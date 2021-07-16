import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
declare  var jQuery:  any;


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  isLogging: boolean = true;
  display = true;
  helper = new JwtHelperService();
  @Input() message={ value:"", color:"" };

  constructor(private httpClient: HttpClient, private route: Router) { }
  ngOnInit(): void {
    if(!this.helper.isTokenExpired(window.localStorage.getItem("token"))){
      this.route.navigate(['/approv']);
    }
  }

  signin(form: NgForm){
    
    let user={
      "courriel": form.value.courriel,
      "password": form.value.password
    }
    this.httpClient.post<any[]>(environment.url+"signin/", user).subscribe(
      (data)=>{
          window.localStorage.clear()
          window.localStorage.setItem("token",data["token"])
          this.route.navigate(['/approv']);
      },
      (error)=>{
        this.isLogging = false;
      }
    );
    
  }



  hide_show(){
    (function ($) {
      $("#show_hide_password").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password input').attr("type") == "text"){
            $('#show_hide_password input').attr('type', 'password');
            $('#show_hide_password i').addClass( "fa-eye-slash" );
            $('#show_hide_password i').removeClass( "fa-eye" );
         }
         else if($('#show_hide_password input').attr("type") == "password"){
            $('#show_hide_password input').attr('type', 'text');
            $('#show_hide_password i').removeClass( "fa-eye-slash" );
            $('#show_hide_password i').addClass( "fa-eye" );
        }
      });
    })(jQuery);
  }
  

  passwordForget(value){
    if(value=='no'){
      this.display = !this.display;
    }
    else{
      this.display = !this.display;
    }
    
  }

  sendEmail(form: NgForm){
    this.httpClient.post("http://172.16.16.195:8000/stock/forgetPassword/", form.value.email).subscribe(
        (data)=>{
          this.message = { value: "Verifiez votre boite mail, un lien de réinitialisation vous sera envoyé.", color: "green"}
        },
        (error)=>{ this.message = { value: "Une erreur a survenue lors de l'execution de votre requete.", color: "red"} 
        }
      );
  }
  
 
}
