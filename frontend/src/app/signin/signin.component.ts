import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  isLogging: boolean = true;
  helper = new JwtHelperService();
  constructor(private httpClient: HttpClient, private route: Router) { }
  ngOnInit(): void {
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
  
 
}
