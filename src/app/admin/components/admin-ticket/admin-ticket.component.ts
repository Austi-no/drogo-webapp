import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/service/api.service';

@Component({
  selector: 'app-admin-ticket',
  templateUrl: './admin-ticket.component.html',
  styleUrls: ['./admin-ticket.component.css']
})
export class AdminTicketComponent implements OnInit {

  form!: FormGroup
  ticketList: any = [];
  selectedTicketMessages: any = [];
  selectedTicketToUpdate: any;
  updateTicketMessage: any;
  filterParam:any
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
      console.log(res);
      this.toastr.success('', "Your ticket is created successfully!")
      this.form.reset()
      this.getTickets()
      this.spinner.hide()

    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })


  }

  getTickets() {
    this.spinner.show()
    this.service.getAllTickets().subscribe((res: any) => {

      this.ticketList = res.tickets
      this.spinner.hide()
    }, (error: any) => {
      this.spinner.hide()
      console.log(error);

    })
  }

  sendMessage(selectedTicket: any) {
    this.selectedTicketToUpdate = {}
    this.ticketList.messages = JSON.parse(selectedTicket.messages)
    this.selectedTicketToUpdate = selectedTicket
    console.log(this.ticketList.messages);

  }

  updateTicket(list: any) {
    var obj = {
      ticket_id: list.id,
      status: list.status,
      text: this.updateTicketMessage
    }

    this.service.updateTicket(obj).subscribe((res: any) => {
      console.log(res);

    })
  }


  changeTicketStatus(e: any, selectedTicket: any) {
    console.log(e);
    console.log(selectedTicket);

    this.toastr.success("", "ticket status is been updated!")
  }

  filter(param: any) {
    this.spinner.show()
    this.service.filterInvoices(param).subscribe((res: any) => {
      console.log(res);
      this.ticketList = res
      this.spinner.hide()
    }, (error: any) => {
      console.log(error);
      this.spinner.hide()
    })
  }
}
