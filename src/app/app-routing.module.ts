import { LandingPageComponent } from './layout/landing-page/landing-page.component';
import { DashbaordComponent } from './layout/dashbaord/dashbaord.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { ForgetPasswordComponent } from './components/security/forget-password/forget-password.component';
import { SignInComponent } from './components/security/sign-in/sign-in.component';
import { SignUpComponent } from './components/security/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: '', component: LandingPageComponent
  },
  {
    path: 'login', component: SignInComponent
  },
  {
    path: 'sign-up', component: SignUpComponent
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'transactions', component: TransactionsComponent
  },
  {
    path: "home", component: HomeComponent,
    children: [
      { path: '', component: DashbaordComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
