import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  @Input() email;
  @Input() areEqual= false;
  helper = new JwtHelperService();

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.email = (this.helper.decodeToken(this.route.snapshot.params['id'])).email
  }

  resetPassword(form: NgForm){
    if(form.value.password1 != form.value.password2){
      this.areEqual = true;
    }
    else{
      this.httpClient.post("http://172.16.16.195:8000/stock/resetPassword/", {password: form.value.password1, email: this.email}).subscribe(
        (data)=>{}
      )
    }
  }

}
