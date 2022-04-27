import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-admin-invoices',
  templateUrl: './admin-invoices.component.html',
  styleUrls: ['./admin-invoices.component.css']
})
export class AdminInvoicesComponent implements OnInit {
  invoiceList: any=[];
  filterParam:any="true"
  constructor(private service:ApiService, private spinner:NgxSpinnerService) { }

  ngOnInit(): void {
    this.getInvoices()
  }
  getInvoices() {
    this.service.getInvoices().subscribe((res: any) => {
      console.log(res);
      this.invoiceList = res

    }, (error: any) => {
      console.log(error);

    })
  }

  filter(param: any) {
    this.spinner.show()
    this.service.filterInvoice(param).subscribe((res: any) => {
      console.log(res);
      this.invoiceList = res
      this.spinner.hide()
    }, (error: any) => {
      console.log(error);
      this.spinner.hide()
    })
  }
}
