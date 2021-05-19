import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProduitsComponent } from './produits/produits.component';
import { ApprovComponent } from './approv/approv.component';
import { ReapprovComponent } from './reapprov/reapprov.component';
import { StatsComponent } from './stats/stats.component';
import { ProduitsService } from './services/produits.service';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ContainerComponent } from './container/container.component';
import { ApprovsService } from './services/approvs.service';
import { AuthService } from './services/auth.service';
import { TicketApprovService } from './services/ticket-approv.service';
import { AngularFileUploaderModule } from "angular-file-uploader";

const appRoutes: Routes = [
  {path: 'produits', component: ProduitsComponent},
  {path: 'approv', component: ApprovComponent},
  {path: 'reapprov', component: ReapprovComponent},
  {path: 'stats', component: StatsComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'signin', component: SigninComponent},
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
    ContainerComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
    AngularFileUploaderModule
  ],
  providers: [ProduitsService, ApprovsService, AuthService, TicketApprovService],
  bootstrap: [AppComponent]
})
export class AppModule { }
