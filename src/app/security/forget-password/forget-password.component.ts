import { AuthService } from '../helpers/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  form!:FormGroup
  public captchaResolved : boolean = false;
  constructor(private router: Router,private authService:AuthService,private fb:FormBuilder, private spinner:NgxSpinnerService,private toastr:ToastrService) { }

  ngOnInit() {
    this.form=this.fb.group({
      recaptchaReactive:[Validators.required],
      username:['',[Validators.required]],
      new_password:['',[Validators.required]],
      securityQuestion:['',[Validators.required]],
      securityAnswer:['',[Validators.required]],
    })
  }
  resetPassword() {
    this.spinner.show()
    // stop here if form is invalids
    if (this.form.invalid) {
      const invalid = [];
      const controls = this.form.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          invalid.push(name);
        }
      }

      this.toastr.error('The Following fields are Invalid: ' + invalid, 'Invalid Fields');
      this.spinner.hide()
      return;

    }

    this.authService.forgotPasssword(this.form.value).subscribe((res: any) => {
      this.spinner.hide()
    if(res?.code==200){
      this.toastr.success("",res.message)
      this.router.navigate(['login'])
    }else{
      this.toastr.error("","An error occurred!")
    }

    },
      (error: any) => {
        this.spinner.hide()
        this.toastr.error("",error.error.detail)

      }
    )
  }

  checkCaptcha(captchaResponse : string) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
}
}
