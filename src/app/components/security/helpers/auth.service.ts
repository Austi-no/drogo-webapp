import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.backend.baseURL;
  constructor(private http: HttpClient) { }

  register(value: any): any {
    return this.http.post(`${this.baseUrl}/webApp/signup`, value)
  }

  login(value: any) {
    let body = new URLSearchParams();
    body.set('username', value.username);
    body.set('password', value.password);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post(`${this.baseUrl}/webApp/login`, body.toString(), options)
  }

  forgotPasssword(value: any) {
    return this.http.post(`${this.baseUrl}/webApp/reset`, value)
  }


}
