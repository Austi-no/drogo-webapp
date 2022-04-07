import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {






  baseUrl: string = environment.backend.baseURL;
  publicUrl: string = environment.backend.publicURL;
  constructor(private http: HttpClient) { }

  createTicket(value: any) {
    return this.http.post(`${this.baseUrl}/createTicket`, value)
  }

  getAllTicket() {
    return this.http.get(`${this.baseUrl}/tickets`)
  }

  getAccount() {
    return this.http.get(`${this.baseUrl}/account`)
  }

  getTransactions() {
    return this.http.get(`${this.baseUrl}/transactions`)
  }

  sendCredit(obj: any) :any{
    return this.http.post(`${this.baseUrl}/sendCredits`,obj)
  }

  getPricing() {
    return this.http.get(`${this.publicUrl}/pricing`)
  }

  payBuyCredit(id: any) {
    return this.http.get(`${this.baseUrl}/payCredits/${id}`)
  }
}
