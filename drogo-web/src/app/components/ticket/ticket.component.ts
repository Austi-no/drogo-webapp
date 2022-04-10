import { ApiService } from './../service/api.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {
  form!: FormGroup
  ticketList: any = [];
  constructor(private fb: FormBuilder, private service: ApiService, private toastr: ToastrService, private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.form = this.fb.group({
      text: ['', [Validators.required]],
      title: ['', [Validators.required]],
    })
    this.getTickets()
  }
  createTicket() {
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
    this.service.createTicket(this.form.value).subscribe((res: any) => {
      // console.log(res);
      this.getTickets()
      this.spinner.hide()

    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })


  }

  getTickets() {
    this.spinner.show()
    this.service.getAllTicket().subscribe((res: any) => {
      this.ticketList = res.tickets
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })
  }
}
