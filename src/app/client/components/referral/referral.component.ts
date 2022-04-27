import { ToastrService } from 'ngx-toastr';
import { ClipboardService } from 'ngx-clipboard';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.css']
})
export class ReferralComponent implements OnInit {
referralLink:any='https://drogoweb.com?ref=12345'
  referralList: any=[];
  constructor(private clipboardApi: ClipboardService,private service:ApiService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getReferrals()
  }
copyRefLink(){
  this.clipboardApi.copyFromContent(this.referralLink)
  this.toastr.success('',"Referral link Copied tp Clipboard")
}

getReferrals(){
  this.service.getUserReferrals().subscribe((res:any)=>{
    console.log(res);
    this.referralList=res.referrals

  })
}
}
