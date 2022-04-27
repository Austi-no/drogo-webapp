import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {

  accountDetail = {
    creditsAvailable: 0,
    is_active: true,
    is_vip: false,
    securityQuestion1: "",
    securityQuestion2: "",
    securityQuestion3: "",
    username: ""
  }
  transactionList: any = [];
  amountOfCredit: any
  username: any;

  constructor(private service: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getAccount();
    this.getTransactions()
  }

  getAccount() {
    this.spinner.show()
    this.service.getUserAccount().subscribe((res: any) => {
      this.accountDetail = res
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      // console.log(error);

    })
  }

  getTransactions() {
    this.spinner.show()
    this.service.getUserTransactions().subscribe((res: any) => {
      console.log(res);
      this.transactionList = res?.transactions
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })
  }

  sendCredit() {
    var obj = {
      username: this.username,
      amountOfCredit: this.amountOfCredit
    }

    this.service.sendCreditToUser(obj).subscribe((res: any) => {
      console.log(res);
      if (res.code == 200) {
        this.username="",
        this.amountOfCredit=""
        this.getAccount()
        this.toastr.success('', res.message)
      }
      else{
        this.toastr.error('', res.message)
      }
    }, (error: any) => {
      this.spinner.hide()
      this.toastr.error("", error.error.detail)

    })

  }


}
