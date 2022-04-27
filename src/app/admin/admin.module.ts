import { AdminTransactionComponent } from './components/admin-transaction/admin-transaction.component';
import { AdminTicketComponent } from './components/admin-ticket/admin-ticket.component';
import { AdminReferralComponent } from './components/admin-referral/admin-referral.component';
import { AdminBuyCreditComponent } from './components/admin-buy-credit/admin-buy-credit.component';
import { AdminHeaderComponent } from './layout/admin-header/admin-header.component';
import { AdminFooterComponent } from './layout/admin-footer/admin-footer.component';
import { AdminSidebarComponent } from './layout/admin-sidebar/admin-sidebar.component';
import { AdminHomeComponent } from './layout/admin-home/admin-home.component';
import { AdminDashboardComponent } from './layout/admin-dashboard/admin-dashboard.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ToastrModule } from 'ngx-toastr';
import { ManageUsersComponent } from './components/manage-users/manage-users.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { AdminInvoicesComponent } from './components/admin-invoices/admin-invoices.component';


@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminHomeComponent,
    AdminSidebarComponent,
    AdminFooterComponent,
    AdminHeaderComponent,
    AdminBuyCreditComponent,
    AdminReferralComponent,
    AdminTicketComponent,
    AdminTransactionComponent,
    ManageUsersComponent,
    AdminInvoicesComponent

  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    ClipboardModule,
    UiSwitchModule,
    ToastrModule.forRoot(),
  ]
})
export class AdminModule { }
