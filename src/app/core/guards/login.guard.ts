import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const loginGuard: CanActivateFn = (route, state) => {

  const cookieService = inject(CookieService)
  const authenticated = !! cookieService.get('dni')
  return authenticated
  // const value: any = cookieService.get("dni")
  // if (!value){
  //   router.navigate(['login'])
  //   return false
  // }else{
  //   router.navigate(['home'])
  //   return true
  // }
  
};
