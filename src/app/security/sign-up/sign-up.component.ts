import { AuthService } from '../helpers/auth.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../helpers/must-match.validator';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ClipboardService } from 'ngx-clipboard';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  public captchaResolved: boolean = false;
  securityQuestions1: any = [];
  securityQuestions2: any = [];
  securityQuestions3: any = [];
  securityQuestions4: any = [];
  openModal: boolean = false
  infoToCopy2: any;
  infoToCopy = {
    username: '',
    contactType: '',
    contactInfo: '',
    securityQuestion1: '',
    securityAnswer1: '',
    securityQuestion2: '',
    securityAnswer2: '',
    securityQuestion3: '',
    securityAnswer3: ''
  };
  constructor(private router: Router, private clipboardApi: ClipboardService, private authService: AuthService, private fb: FormBuilder, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.form = this.fb.group({
      recaptchaReactive: [Validators.required],
      username: ['', [Validators.required]],
      contactType: ['Contact Type', [Validators.required]],
      contactInfo: ['', [Validators.required]],
      securityQuestion1: ['Select Question 1', [Validators.required]],
      securityAnswer1: ['', [Validators.required]],
      securityQuestion2: ['Select Question 2', [Validators.required]],
      securityAnswer2: ['', [Validators.required]],
      securityQuestion3: ['Select Question 3', [Validators.required]],
      securityAnswer3: ['', [Validators.required]],
      invite: [''],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confirmPassword: ["", Validators.required],
    },
      {
        validator: MustMatch("password", "confirmPassword"),
      }


    )

    this.getAllQuestions();
    this.questionChanges1()
    this.questionChanges2()
    this.questionChanges3()
  }

  register() {
    this.infoToCopy = {
      username: this.form.value.username,
      contactType: this.form.value.contactType,
      contactInfo: this.form.value.contactInfo,
      securityQuestion1: this.form.value.contactInfo,
      securityAnswer1: this.form.value.securityAnswer1,
      securityQuestion2: this.form.value.securityQuestion2,
      securityAnswer2: this.form.value.securityAnswer2,
      securityQuestion3: this.form.value.securityQuestion3,
      securityAnswer3: this.form.value.securityAnswer3,
    }

    this.infoToCopy2 = `
    Username: ${this.infoToCopy.username}
    Contact Type: ${this.infoToCopy.contactType}
    Contact Info: ${this.infoToCopy.contactInfo}
    SecurityQuestion 1: ${this.infoToCopy.securityQuestion1}
    SecurityAnswer 1: ${this.infoToCopy.securityAnswer1}
    SecurityQuestion 2: ${this.infoToCopy.securityQuestion2}
    SecurityAnswer 2: ${this.infoToCopy.securityAnswer2}
    SecurityQuestion 3: ${this.infoToCopy.securityQuestion3}
    SecurityAnswer 3: ${this.infoToCopy.securityAnswer3}

    `
    this.clipboardApi.copyFromContent(this.infoToCopy2)
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
    this.openModal = true
    this.authService.register(this.form.value).subscribe((res: any) => {
      this.spinner.hide()
      if (res.access_token) {
        this.toastr.success("", "Registration Successful")
      }

    },
      (error: any) => {
        console.log(error);
        this.spinner.hide()
        this.toastr.error("", error.error.detail)
      }
    )
  }

  getAllQuestions() {
    const questions = [
      { id: 1, question: "What is the first name of your best friend in high school?" },
      { id: 2, question: "What was the name of your first pet?" },
      { id: 3, question: "What was the first thing you learned to cook?" },
      { id: 4, question: "Where did you go the first time you flew on a plane?" },
      { id: 5, question: "In what city did your parents meet?" },
      { id: 6, question: "What was the first name of your first boss?" },
      { id: 7, question: "What is the name of the street where you grew up?" },
      { id: 8, question: "What is the name of your favorite sports team?" },
      { id: 9, question: "What is your dream job?" },
      { id: 10, question: "What is your favorite children's book?" },
      { id: 11, question: "What was the model of your first car?" },
      { id: 12, question: "What was your childhood nickname?" },

    ];
    this.securityQuestions1 = questions;
    this.securityQuestions2 = questions;
    this.securityQuestions3 = questions
  }

  questionChanges1() {
    this.form.controls['securityQuestion1'].valueChanges
      .subscribe((question) => {
        this.securityQuestions2 = this.securityQuestions1.filter((q: any) => q.question != question)
      })

  }
  questionChanges2() {
    this.form.controls['securityQuestion2'].valueChanges
      .subscribe((question) => {
        this.securityQuestions3 = this.securityQuestions2.filter((q: any) => q.question != question)
      })
  }

  questionChanges3() {
    this.form.controls['securityQuestion3'].valueChanges
      .subscribe((question) => {
        this.securityQuestions4 = this.securityQuestions1.filter((q: any) => q.question != question)
      })
  }

  checkCaptcha(captchaResponse: string) {
    this.captchaResolved = (captchaResponse && captchaResponse.length > 0) ? true : false
  }

  copyToClipboard(): any {
    this.toastr.success("Success", "Your Info copied to Clipboard")
    this.router.navigate(['login'])
  }


}
