import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuyCreditComponent } from './components/buy-credit/buy-credit.component';
import { ReferralComponent } from './components/referral/referral.component';
import { AuthGuard } from '../security/helpers/auth.guard';
import { TicketComponent } from './components/ticket/ticket.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { DashbaordComponent } from './layout/dashbaord/dashbaord.component';
import { ProfileComponent } from '../security/profile/profile.component';

const routes: Routes = [
  {path:'',redirectTo:'/dashboard',pathMatch:'full'},
  { path: 'dashboard', component: DashbaordComponent },
  { path: "transactions", component: TransactionsComponent },
  { path: "ticket", component: TicketComponent },
  { path: "buyCredit", component: BuyCreditComponent },
  { path: "profile", component: ProfileComponent },
  { path: "referral", component: ReferralComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
