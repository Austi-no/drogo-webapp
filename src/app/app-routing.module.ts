import { AdminGuard } from './security/helpers/admin.guard';
import { AdminHomeComponent } from './admin/layout/admin-home/admin-home.component';
import { AdminLoginComponent } from './security/admin-login/admin-login.component';
import { ReferralComponent } from './client/components/referral/referral.component';
import { ProfileComponent } from './security/profile/profile.component';
import { BuyCreditComponent } from './client/components/buy-credit/buy-credit.component';
import { TicketComponent } from './client/components/ticket/ticket.component';
import { AuthGuard } from './security/helpers/auth.guard';
import { LandingPageComponent } from './client/layout/landing-page/landing-page.component';
import { DashbaordComponent } from './client/layout/dashbaord/dashbaord.component';
import { TransactionsComponent } from './client/components/transactions/transactions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './client/layout/home/home.component';
import { ForgetPasswordComponent } from './security/forget-password/forget-password.component';
import { SignInComponent } from './security/sign-in/sign-in.component';
import { SignUpComponent } from './security/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'admin/auth/login', component: AdminLoginComponent },
  {
    path: "client", component: HomeComponent,
    children: [
      { path: '', loadChildren: () => import('../app/client/client.module').then(m => m.ClientModule), canActivate: [AuthGuard] },
    ]
  },
  {
    path: "admin", component: AdminHomeComponent,
    children: [
      { path: '', loadChildren: () => import('../app/admin/admin.module').then(m => m.AdminModule)},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
