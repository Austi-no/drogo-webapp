import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {







  clientBaseURL: string = environment.backend.clientBaseURL;
  adminBaseURL:string=environment.backend.adminBaseURL
  constructor(private http: HttpClient) { }

  createTicket(value: any) {
    return this.http.post(`${this.clientBaseURL}/webApp/createTicket`, value)
  }

  getUserTicket():any {
    return this.http.get(`${this.clientBaseURL}/webApp/tickets`)
  }
  updateUserTicket(data:any){
    return this.http.post(`${this.clientBaseURL}/webApp/updateTicket`, data)
  }

  getUserAccount():any {
    return this.http.get(`${this.clientBaseURL}/webApp/account`)
  }

  getUserTransactions():any {
    return this.http.get(`${this.clientBaseURL}/webApp/transactions`)
  }

  sendCreditToUser(obj: any) :any{
    return this.http.post(`${this.clientBaseURL}/webApp/sendCredits`,obj)
  }

  getPricing():any {
    return this.http.get(`${this.clientBaseURL}/public/pricing`)
  }

  generatePaymentForCredit(planID: any):any {
    return this.http.get(`${this.clientBaseURL}/webApp/credits/confirm/${planID}`)
  }

  payForCredit(planID: any,payID:any) {
    return this.http.get(`${this.clientBaseURL}/webApp/credits/pay/${planID}?pay_id=${payID}`)
  }

  getUserReferrals():any {
    return this.http.get(`${this.clientBaseURL}/webApp/referrals`)
  }

  redeemCode(redeemCode: any) :any{
    return this.http.get(`${this.clientBaseURL}/webApp/redeemCode?code_to_redeem=${redeemCode}`,{})
  }

  // ------------- ADMIN ENDPOINT-----------

  getUsers():any{
    return this.http.get(`${this.adminBaseURL}/users`)
  }

  getInvoices():any{
    return this.http.get(`${this.adminBaseURL}/invoices`)
  }
  filterInvoice(query: any) {
    return this.http.get(`${this.adminBaseURL}/invoices?isPaid=${query}`)
  }


  getAllTransactions():any{
    return this.http.get(`${this.adminBaseURL}/transactions`)
  }

  filterTransactions(query:any){
    return this.http.get(`${this.adminBaseURL}/transactions?isCompleted=${query}`)
  }
  getAllTickets():any{
    return this.http.get(`${this.adminBaseURL}/tickets`)
  }
  updateTicket(data:any):any{
    return this.http.post(`${this.adminBaseURL}/tickets/update`,data)
  }

  changeTicketStatus(data:any):any{
    return this.http.post(`${this.adminBaseURL}/tickets/changeStatus`,data)
  }
  filterInvoices(query: any) {
    return this.http.get(`${this.adminBaseURL}/tickets?isOpen=${query}`)
  }
  changeUserStatus(data:any):any{
    return this.http.post(`${this.adminBaseURL}/users/changeStatus`,data)
  }

  topUp(data:any):any{
    return this.http.post(`${this.adminBaseURL}/users/topUp`,data)
  }



  filterUser(query:any):any{
    return this.http.get(`${this.adminBaseURL}/users?active=${query}`)
  }

}
