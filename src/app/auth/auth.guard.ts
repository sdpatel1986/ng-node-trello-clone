import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';

import { ApiHandlerService } from '../api-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private apiHandlerService: ApiHandlerService,
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = this.apiHandlerService.currentUserValue();
    if (currentUser && currentUser.token) {
        // authorised so return true
        return true;
    }

    // not logged in so redirect to login
    this.router.navigate(['']);
    return false;
}
}
