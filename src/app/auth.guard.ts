import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { Injectable } from '@angular/core';

import { AuthenticationService } from './services/authentication.service';


@Injectable()
export class AuthGuard implements CanActivate{

  constructor(private authService: AuthenticationService, private router: Router){
  }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot):
    boolean | Observable<boolean> | Promise<boolean> {

    const isAuth = this.authService.getIsAuth();

    if (!isAuth){
      this.router.navigate(['/']);
    }

    return isAuth;
  }
}
