import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css']
})
export class AdminHeaderComponent implements OnInit {

  accountDetail = {
    creditsAvailable: 0,
    is_active: true,
    is_vip: false,
    securityQuestion1: "",
    securityQuestion2: "",
    securityQuestion3: "",
    username: ""
  }

  constructor(private service: ApiService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {

    this.getAccount();
  }

  getAccount() {
    this.spinner.show()
    this.service.getUserAccount().subscribe((res: any) => {
      // console.log(res);
      this.accountDetail = res
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })
  }

  logout() {
    sessionStorage.clear()
    this.router.navigate(['login'])
  }
}
