import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from './../../components/service/api.service';
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
  amountOfCredits: any
  username: any;
  redeemCode:any

  constructor(private service: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getAccount();
    this.getTransactions()
  }

  getAccount() {
    this.spinner.show()
    this.service.getAccount().subscribe((res: any) => {
      // console.log(res);
      this.accountDetail = res
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })
  }

  getTransactions() {
    this.spinner.show()
    this.service.getTransactions().subscribe((res: any) => {
      // console.log(res);
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
      amountOfCredits: this.amountOfCredits
    }
    // console.log(obj);
    this.service.sendCredit(obj).subscribe((res:any)=>{
      console.log(res);

    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })

  }
}
