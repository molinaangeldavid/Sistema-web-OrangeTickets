import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { catchError, map, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export const loginGuard: CanActivateFn = (route, state) => {
  const pathUrl = environment.apiUrl
  const cookieService = inject(CookieService)
  const router = inject(Router)
  const http = inject(HttpClient)
  const token = cookieService.get('tokenEstudiante')
  const path = `${pathUrl}/api/estudiantes`
  if(!token){
    router.navigate(['/login'])
    return of(false);
  }
  const headers = {'Authorization': `Bearer ${token}`}
  return http.post(`${path}/isAuthenticated`,{},{headers}).pipe(
    map((response: any) => {
      if(response.isValid){
        return true;
      }else{
        router.navigate(['/login'])
        return false
      }
    }),
    catchError(() => {
      router.navigate(['/login'])
      return of(false)
    })
  )
};
