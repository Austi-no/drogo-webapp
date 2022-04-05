import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/components/service/api.service';
declare const sidebarToggle: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  accountDetail: any;

  constructor(private service: ApiService, private spinner: NgxSpinnerService, private router: Router) { }

  ngOnInit() {

    this.getAccount();
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
  toggle() {
    //On Full Screen
    // console.log("clicked")
    // var wrapper = document.querySelector(".menu-toggle-btn");
    // wrapper?.classList.toggle("sidebar-nav-wrapper");

  }
  logout(){
    sessionStorage.clear()
    this.router.navigate(['login'])
  }
}
