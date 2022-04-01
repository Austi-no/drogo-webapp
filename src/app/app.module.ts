import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './layout/home/home.component';
import { SignUpComponent } from './layout/sign-up/sign-up.component';
import { SignInComponent } from './layout/sign-in/sign-in.component';
import { ForgetPasswordComponent } from './layout/forget-password/forget-password.component';
import { TransactionsComponent } from './components/transactions/transactions.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignUpComponent,
    SignInComponent,
    ForgetPasswordComponent,
    TransactionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
