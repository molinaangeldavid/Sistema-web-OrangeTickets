import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

export const adminGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService)
  const authenticated = cookieService.get('dniAdmin')
  return !!authenticated
};
