import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-buy-credit',
  templateUrl: './buy-credit.component.html',
  styleUrls: ['./buy-credit.component.css']
})
export class BuyCreditComponent implements OnInit {
  pricingList: any = []
  generatedCreditInfo: any = {};
  selectedCreditPlanID: any;
  showPaymentURL: boolean = false
  creditInvoicePayment: any;
  @ViewChild('closeModal') closeModal!: ElementRef
  constructor(private service: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getPricing()
  }
  getPricing() {
    this.spinner.show()
    this.service.getPricing().subscribe((res: any) => {
      this.pricingList = res.plans
      // console.log(res.plans);

      this.spinner.hide()

    }, (error: any) => {
      console.log(error);
      this.spinner.hide()
    })
  }

  buyCredit(list: any) {

    this.selectedCreditPlanID = list.id
    this.spinner.show()
    this.service.generatePaymentForCredit(list?.id).subscribe((res: any) => {
      // console.log(res);
      this.generatedCreditInfo = res
      this.spinner.hide()

    }, (error: any) => {
      // console.log(error);
      this.spinner.hide()
    })
  }

  payNow(generatedCreditInfo: any) {
    this.spinner.show()
    console.log(generatedCreditInfo);
    this.service.payForCredit(this.selectedCreditPlanID, 0).subscribe((res: any) => {
      this.creditInvoicePayment = res
      this.spinner.hide()
      if (res.status == "NEW" || res.status == "PENDING") {
        this.showPaymentURL = true

      }
      if (res.status == "COMPLETED") {
        this.toastr.success(res.status, "Your transaction is completed!")
        this.closeModal.nativeElement.click()
      }

    }, (error: any) => {
      this.spinner.hide()
      if (error.status == 400) {
        this.toastr.error('', "Initiating Payment failed!")
      }

    })


  }

  closeCreditModal(){
    setTimeout(() => {
     this.showPaymentURL=false
      this.closeModal.nativeElement.click()
    }, 2000);

  }
}
