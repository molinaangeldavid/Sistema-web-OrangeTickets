import { HttpHeaders, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const cookieService = inject(CookieService)

  const token = cookieService.get('tokenEstudiante');
  if(token){ 
    const clonedReq = req.clone({
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}` 
      })
    })
    return next(clonedReq)
  }
  console.log('Solicitud sin token:', req);
  return next(req);
};


