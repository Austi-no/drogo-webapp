import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../helpers/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  form!: FormGroup
  public captchaResolved: boolean = false;
  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService, private spinner: NgxSpinnerService, private toastr: ToastrService) { }

  ngOnInit() {
    sessionStorage.clear()
    this.form = this.fb.group({
      recaptchaReactive: [Validators.required],
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    })
  }

  login() {
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

    this.authService.adminLogin(this.form.value).subscribe((res: any) => {
      this.spinner.hide()
      if (res.access_token) {
        sessionStorage.setItem('token', res.access_token);
        this.toastr.success("", "Login Successful")
        this.router.navigate(['/admin/dashboard'])
      }

    },
      (error: any) => {
        this.spinner.hide()
        this.toastr.error("Try Again", error.error.detail)
        // console.log(error);

      }
    )
  }

  checkCaptcha(captchaResponse: string) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
  }

}


