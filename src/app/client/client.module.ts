import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { BuyCreditComponent } from './components/buy-credit/buy-credit.component';
import { ReferralComponent } from './components/referral/referral.component';
import { ForgetPasswordComponent } from '../security/forget-password/forget-password.component';
import { ProfileComponent } from '../security/profile/profile.component';
import { SignInComponent } from '../security/sign-in/sign-in.component';
import { SignUpComponent } from '../security/sign-up/sign-up.component';
import { TicketComponent } from './components/ticket/ticket.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { DashbaordComponent } from './layout/dashbaord/dashbaord.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { HomeComponent } from './layout/home/home.component';
import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';


@NgModule({
  declarations: [
    HomeComponent,
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
    CommonModule,
    ClientRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ClipboardModule,
    ToastrModule.forRoot(),
  ]
})
export class ClientModule { }
