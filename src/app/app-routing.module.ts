import { TransactionsComponent } from './components/transactions/transactions.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './layout/home/home.component';
import { SignInComponent } from './layout/sign-in/sign-in.component';
import { SignUpComponent } from './layout/sign-up/sign-up.component';
import { ForgetPasswordComponent } from './layout/forget-password/forget-password.component';

const routes: Routes = [
  {
    path:'', component:HomeComponent
  },
  {
    path:'sign-in', component:SignInComponent
  },
  {
    path:'sign-up', component:SignUpComponent
  },
  {
    path:'forget-password', component:ForgetPasswordComponent
  },
  {
    path:'transactions', component:TransactionsComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{useHash:true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
