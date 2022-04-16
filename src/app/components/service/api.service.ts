import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {






  baseUrl: string = environment.backend.baseURL;
  constructor(private http: HttpClient) { }

  createTicket(value: any) {
    return this.http.post(`${this.baseUrl}/webApp/createTicket`, value)
  }

  getAllTicket() {
    return this.http.get(`${this.baseUrl}/webApp/tickets`)
  }
  updateTicket(data:any){
    return this.http.post(`${this.baseUrl}/webApp/updateTicket`, data)
  }

  getAccount() {
    return this.http.get(`${this.baseUrl}/webApp/account`)
  }

  getTransactions() {
    return this.http.get(`${this.baseUrl}/webApp/transactions`)
  }

  sendCredit(obj: any) :any{
    return this.http.post(`${this.baseUrl}/webApp/sendCredits`,obj)
  }

  getPricing() {
    return this.http.get(`${this.baseUrl}/public/pricing`)
  }

  generatePaymentForCredit(planID: any) {
    return this.http.get(`${this.baseUrl}/webApp/credits/confirm/${planID}`)
  }

  payForCredit(planID: any,payID:any) {
    return this.http.get(`${this.baseUrl}/webApp/credits/pay/${planID}?pay_id=${payID}`)
  }

  getReferrals() {
    return this.http.get(`${this.baseUrl}/webApp/referrals`)
  }

  redeemCode(redeemCode: any) :any{
    return this.http.get(`${this.baseUrl}/webApp/redeemCode?code_to_redeem=${redeemCode}`,{})
  }


}
