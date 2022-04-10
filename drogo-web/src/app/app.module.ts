import { TicketComponent } from './components/ticket/ticket.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './layout/home/home.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HeaderComponent } from './layout/header/header.component';
import { DashbaordComponent } from './layout/dashbaord/dashbaord.component';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ForgetPasswordComponent } from './components/security/forget-password/forget-password.component';
import { SignInComponent } from './components/security/sign-in/sign-in.component';
import { SignUpComponent } from './components/security/sign-up/sign-up.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthInterceptor } from './components/security/helpers/auth.interceptor';
import { BuyCreditComponent } from './components/buy-credit/buy-credit.component';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ProfileComponent } from './components/security/profile/profile.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ReferralComponent } from './components/referral/referral.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    ForgetPasswordComponent,
    TransactionsComponent,
    SidebarComponent,
    HeaderComponent,
    DashbaordComponent,
    LandingPageComponent,
    FooterComponent,
    TicketComponent,
    BuyCreditComponent,
    ProfileComponent,
    ReferralComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,RecaptchaModule,RecaptchaFormsModule,ClipboardModule,
    ToastrModule.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
