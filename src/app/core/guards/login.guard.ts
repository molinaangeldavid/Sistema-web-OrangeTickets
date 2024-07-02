import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';

export const loginGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService)

  const router = inject(Router);
  return true
  // const value: any = cookieService.get("dni")
  // if (!value){
  //   router.navigate(['login'])
  //   return false
  // }else{
  //   router.navigate(['home'])
  //   return true
  // }
  
};
