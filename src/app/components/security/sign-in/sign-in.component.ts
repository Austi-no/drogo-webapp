import { AuthService } from './../helpers/auth.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  form!:FormGroup
  constructor(private router:Router,private fb:FormBuilder, private authService:AuthService, private spinner:NgxSpinnerService, private toastr:ToastrService) { }

  ngOnInit() {
    this.form=this.fb.group({
      username:['',[Validators.required]],
      password:['',[Validators.required]],
    })
  }


  register(){
    this.router.navigate(['sign-up'])

  }
  forgotPassword(){
    this.router.navigate(['forget-password'])
  }

  login(){
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

    this.authService.login(this.form.value).subscribe((res: any) => {
      console.log(res);
      this.spinner.hide()
    },
      (error: any) => {
        console.log(error);

      }
    )
  }

}