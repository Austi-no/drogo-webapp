import { UiSwitchModule } from 'ngx-ui-switch';

import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AuthInterceptor } from './security/helpers/auth.interceptor';
import { RecaptchaFormsModule, RecaptchaModule } from 'ng-recaptcha';
import { ClipboardModule } from 'ngx-clipboard';
import { ForgetPasswordComponent } from './security/forget-password/forget-password.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { SignUpComponent } from './security/sign-up/sign-up.component';
import { AdminDashboardComponent } from './admin/layout/admin-dashboard/admin-dashboard.component';
import { AdminLoginComponent } from './security/admin-login/admin-login.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ForgetPasswordComponent,
    SignUpComponent,
    AdminLoginComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,UiSwitchModule,
    NgxSpinnerModule,RecaptchaModule,RecaptchaFormsModule,ClipboardModule,
    ToastrModule.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class AppModule { }
