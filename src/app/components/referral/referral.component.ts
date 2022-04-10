import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
referralLink='https://drogoweb.com?ref=12345'
  constructor(private clipboardApi: ClipboardService,private toastr:ToastrService) { }

  ngOnInit(): void {
  }
copyRefLink(){
  this.clipboardApi.copyFromContent(this.referralLink)
  this.toastr.success('',"Referral link Copied tp Clipboard")
}
}
