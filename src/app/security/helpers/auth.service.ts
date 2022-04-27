import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  clientBaseURL: string = environment.backend.clientBaseURL;
  adminBaseURL:string=environment.backend.adminBaseURL
  constructor(private http: HttpClient) { }

  register(value: any): any {
    return this.http.post(`${this.clientBaseURL}/webApp/signup`, value)
  }

  login(data: any) {
    let body = new URLSearchParams();
    body.set('username', data.username);
    body.set('password', data.password);

    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    return this.http.post(`${this.clientBaseURL}/webApp/login`, body.toString(), options)
  }

  forgotPasssword(value: any) {
    return this.http.post(`${this.clientBaseURL}/webApp/reset`, value)
  }

  // ------------ADMIN ENDPOINT

  adminLogin(data:any){
    return this.http.post(`${this.adminBaseURL}/signin`,data)
  }


}
