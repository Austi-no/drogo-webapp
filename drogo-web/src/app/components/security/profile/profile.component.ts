import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  accountDetail = {
    creditsAvailable: 0,
    is_active: true,
    is_vip: false,
    securityQuestion1: "",
    securityQuestion2: "",
    securityQuestion3: "",
    username: ""
  }


  constructor(private service: ApiService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getAccount();
  }

  getAccount() {
    this.spinner.show()
    this.service.getAccount().subscribe((res: any) => {
      this.accountDetail = res
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })
  }


}
