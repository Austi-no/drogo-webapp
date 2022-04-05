import { AuthService } from './../helpers/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form!: FormGroup
  constructor(private router: Router, private authService: AuthService, private fb: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    // this.spinner.show()

    this.form = this.fb.group({
      username: ['', [Validators.required]],
      contactType: ['Select Contact Type', [Validators.required]],
      contactInfo: ['', [Validators.required]],
      securityQuestion1: ['', [Validators.required]],
      securityAnswer1: ['', [Validators.required]],
      securityQuestion2: ['', [Validators.required]],
      securityAnswer2: ['', [Validators.required]],
      securityQuestion3: ['', [Validators.required]],
      securityAnswer3: ['', [Validators.required]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    },
      {
        validator: MustMatch("password", "confirmPassword"),
      }


    )
  }

  register() {
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

    this.authService.register(this.form.value).subscribe((res: any) => {
      this.spinner.hide()
      if (res.access_token) {
        this.toastr.success("", "Registration Successful")
        this.router.navigate(['login'])
      }

    },
      (error: any) => {
        console.log(error);
        this.spinner.hide()
        this.toastr.error("",error.error.detail)
      }
    )
  }
  login() {
    this.router.navigate(['login'])
  }
}
