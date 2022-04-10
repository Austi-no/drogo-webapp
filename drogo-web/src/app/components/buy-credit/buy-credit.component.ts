import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-buy-credit',
  templateUrl: './buy-credit.component.html',
  styleUrls: ['./buy-credit.component.css']
})
export class BuyCreditComponent implements OnInit {
  pricingList: any=[]
  constructor(private service: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getPricing()
  }
  getPricing() {
    this.spinner.show()
    this.service.getPricing().subscribe((res: any) => {
      this.pricingList = res.plans
      this.spinner.hide()

    }, (error: any) => {
      console.log(error);
      this.spinner.hide()
    })
  }

  buyCredit(list: any) {
    this.spinner.show()
    this.service.payBuyCredit(list?.id).subscribe((res: any) => {
      console.log(res);
      this.spinner.hide()

    },(error:any)=>{
      console.log(error);
      this.spinner.hide()
    })
  }
}
