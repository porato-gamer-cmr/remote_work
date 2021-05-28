import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import jwt_token from 'jwt-decode';


@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  constructor(private route: Router) { }
  role;
  ngOnInit(): void {
    let data=jwt_token(window.localStorage.getItem("token"))
    console.log(data['role']);
    this.role=data['role'];
  }

  logOut(){
    window.localStorage.clear()
    this.route.navigate(['/signin']);
  }

}
