import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token =sessionStorage.getItem('token');;
    // var role = sessionStorage.getItem('role')

    if (token ) {
      return true;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(["login"]);
    return false;
  }

}
