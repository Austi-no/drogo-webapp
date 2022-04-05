import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from './../service/api.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactionList: any;

  constructor(private service:ApiService,private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getTransactions()
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
}
