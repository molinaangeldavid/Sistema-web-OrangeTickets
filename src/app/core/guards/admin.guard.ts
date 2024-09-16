import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { of,map, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const adminGuard: CanActivateFn = (route, state) => {
  const pathUrl = environment.apiUrl
  const cookieService = inject(CookieService)
  const router = inject(Router)
  const http = inject(HttpClient)
  const token = cookieService.get('tokenAdmin')
  const path = `${pathUrl}/api/admin`
  if(!token){
    router.navigate(['/login/admin'])
    return of(false);
  }
  const headers = {'Authorization': `Bearer ${token}`}
  return http.post(`${path}/isAuthenticated`,{},{headers}).pipe(
    map((response: any) => {
      if(response.isValid){
        return true;
      }else{
        router.navigate(['/login/admin'])
        return false
      }
    }),
    catchError(() => {
      router.navigate(['/login/admin'])
      return of(false)
    })
  )
};
