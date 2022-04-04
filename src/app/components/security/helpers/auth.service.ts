import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.backend.baseURL;
  constructor(private http: HttpClient) { }

  register(value: any): any {
    return this.http.post(`${this.baseUrl}/signup`, value)
  }

  login(value: any) {
    return this.http.post(`${this.baseUrl}/login`, value)
  }

  forgotPasssword(value: any) {
    return this.http.post(`${this.baseUrl}/reset`, value)
  }


}
