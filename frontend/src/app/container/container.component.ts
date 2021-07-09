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
  name;
  ngOnInit(): void {
    let data=jwt_token(window.localStorage.getItem("token"))
    this.role=data['role'];
    this.name = data['name'] 
  }

  logOut(){
    window.localStorage.clear()
    this.route.navigate(['/signin']);
  }

}
