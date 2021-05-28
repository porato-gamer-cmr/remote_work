import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenVerificationService {

  helper = new JwtHelperService();
  constructor(private route : Router) { 

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if(!this.helper.isTokenExpired(window.localStorage.getItem("token"))){
      return true;
    }else {
      this.route.navigate(['/signin']);
    }
  }
}
