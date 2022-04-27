import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-admin-transaction',
  templateUrl: './admin-transaction.component.html',
  styleUrls: ['./admin-transaction.component.css']
})
export class AdminTransactionComponent implements OnInit {
  transactionList: any = [];
  filterParam: any="true"
  constructor(private service: ApiService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getTransactions()
  }
  getTransactions() {
    this.spinner.show()
    this.service.getAllTransactions().subscribe((res: any) => {
      console.log(res);
      this.transactionList = res
      this.spinner.hide()
    }, (error: any) => {
      console.log(error);

    })
  }
  filter(param: any) {
    this.spinner.show()
    this.service.filterTransactions(param).subscribe((res: any) => {
      console.log(res);
      this.transactionList = res
      this.spinner.hide()
    }, (error: any) => {
      console.log(error);
      this.spinner.hide()
    })
  }
}
