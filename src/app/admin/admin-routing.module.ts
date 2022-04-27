import { AdminInvoicesComponent } from './components/admin-invoices/admin-invoices.component';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { AdminReferralComponent } from './components/admin-referral/admin-referral.component';
import { AdminBuyCreditComponent } from './components/admin-buy-credit/admin-buy-credit.component';
import { AdminTransactionComponent } from './components/admin-transaction/admin-transaction.component';
import { AdminTicketComponent } from './components/admin-ticket/admin-ticket.component';
import { AdminDashboardComponent } from './layout/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from '../security/profile/profile.component';

const routes: Routes = [
  {path:'',redirectTo:'/dashboard',pathMatch:'full'},
  { path: 'dashboard', component: AdminDashboardComponent },
  { path: "transactions", component: AdminTransactionComponent },
  { path: "ticket", component: AdminTicketComponent },
  { path: "buyCredit", component: AdminBuyCreditComponent },
  { path: "profile", component: ProfileComponent },
  { path: "referral", component: AdminReferralComponent },
  { path: "manage/users", component: ManageUsersComponent },
  { path: "invoice", component: AdminInvoicesComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
