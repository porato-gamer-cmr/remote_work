import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProduitsComponent } from './produits/produits.component';
import { ApprovComponent } from './approv/approv.component';
import { ReapprovComponent } from './reapprov/reapprov.component';
import { StatsComponent } from './stats/stats.component';
import { ProduitsService } from './_services/produits.service';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ContainerComponent } from './container/container.component';
import { ApprovsService } from './_services/approvs.service';
import { TicketApprovService } from './_services/ticket-approv.service';
import { TokenVerificationService } from './_guards/token-verification.service';
import { TokenInterceptorService } from './_guards/token-interceptor.service';
import { BudgetComponent } from './budget/budget.component';

const appRoutes: Routes = [
  {path: 'produits', component: ProduitsComponent, canActivate:[TokenVerificationService]},
  {path: 'approv', component: ApprovComponent, canActivate:[TokenVerificationService]},
  {path: 'reapprov', component: ReapprovComponent, canActivate:[TokenVerificationService]},
  {path: 'stats', component: StatsComponent, canActivate:[TokenVerificationService]},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
  {path: 'budget', component: BudgetComponent},
  {path: '', redirectTo: 'signin', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    AppComponent,
    ProduitsComponent,
    ApprovComponent,
    ReapprovComponent,
    StatsComponent,
    SigninComponent,
    SignupComponent,
    ContainerComponent,
    BudgetComponent,
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
  ],
  providers: [ProduitsService, ApprovsService, TicketApprovService, TokenVerificationService, {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
