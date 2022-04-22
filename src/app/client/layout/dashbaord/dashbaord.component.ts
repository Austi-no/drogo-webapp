import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from '../../components/service/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashbaord',
  templateUrl: './dashbaord.component.html',
  styleUrls: ['./dashbaord.component.css']
})
export class DashbaordComponent implements OnInit {
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
  codeToRedeem: any;

  constructor(private service: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getAccount();
    this.getTransactions()
  }

  getAccount() {
    this.spinner.show()
    this.service.getAccount().subscribe((res: any) => {
      this.accountDetail = res
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      // console.log(error);

    })
  }

  getTransactions() {
    this.spinner.show()
    this.service.getTransactions().subscribe((res: any) => {
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

    this.service.sendCredit(obj).subscribe((res: any) => {
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

  redeemCode() {
    this.service.redeemCode(this.codeToRedeem).subscribe((res: any) => {
      if (res.code == "0") {
        this.toastr.success("", res.message)
      }
      if (res.code == "-1") {
        this.toastr.error("", res.message)
      }
    }, (error: any) => {
      console.log(error);

      this.spinner.hide()
      this.toastr.error("", error.error.detail)

    })
  }
}
