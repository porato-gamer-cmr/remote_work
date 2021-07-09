import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ApprovsService } from '../_services/approvs.service';
import { Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
declare  var jQuery:  any;



@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  users=[];
  usersSubject = new Subject<any []>();
  usersSubscription: Subscription;
  isSignup: boolean = true;
  constructor(private httpClient: HttpClient, private route: Router, private approvsServices: ApprovsService) { }

  ngOnInit(): void {
    this.listuser();
  }

  listuser(){
    this.httpClient.get(environment.url+"listuser").subscribe(
      (data: any[])=>{
        this.users = data;
      }
    );
  }

  signup(form: NgForm){
    let user={
      name: form.value.name,
      courriel: form.value.courriel,
      password: form.value.password,
      superieur: form.value.superieur,
      role: form.value.role
    };
    this.httpClient.post<any[]>(environment.url+"signup/", user).subscribe(
      (data)=>{
        this.route.navigate(['/signin']);
      }, (error)=>{
        this.isSignup = false;
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

}
