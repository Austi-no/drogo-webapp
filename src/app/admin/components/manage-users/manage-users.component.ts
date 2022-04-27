import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.css']
})
export class ManageUsersComponent implements OnInit {
  userList: any = [];
  selectedUserDetail: any;
  creditAmount: any
  topUpAction: any
  filterParam: any = "true"
  @ViewChild('closeTopUp') closeTopUp!: ElementRef
  @ViewChild('closeDeduct') closeDeduct!: ElementRef
  constructor(private service: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.getUsers()
  }

  getUsers() {
    this.spinner.show()
    this.service.getUsers().subscribe((res: any) => {
      console.log(res);
      this.userList = res
      this.spinner.hide()
    }, (error: any) => {
      console.log(error);
      this.spinner.hide()

    })
  }

  changeUserStatus(e: any) {
    console.log(e);

  }

  topUp(data: any, topUpAction: any) {
    // this.spinner.show();
    var obj = {
      user_id: data.id,
      credit: this.creditAmount,
      operation: topUpAction
    }

    this.service.topUp(obj).subscribe((res: any) => {

      console.log(res);
      if (res.code === 0) {

        this.toastr.success("", res.message)

        if (topUpAction === "ADD") {
          this.closeTopUp.nativeElement.click()
        }
        if (topUpAction === "REMOVE") {
          this.closeDeduct.nativeElement.click()
        }
        this.creditAmount = "";
        this.getUsers()
        this.spinner.hide()
      } else {
        this.toastr.error("", res.message)
      }
    }, (error: any) => {
      console.log(error);
      this.spinner.hide()

    })

  }
  selectedUser(user: any) {
    console.log(user);

    this.selectedUserDetail = user
  }


  filter(param: any) {
    this.spinner.show()
    this.service.filterUser(param).subscribe((res: any) => {
      console.log(res);
      this.userList = res
      this.spinner.hide()

    }, (error: any) => {
      console.log(error);
      this.spinner.hide()

    })
  }
}
