import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  
  token: any
  
  path: any = "http://localhost:3000"
  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
  ) { 
  }
  
  getReservation(dni: any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/reservas/${dni}`,{headers})
  }
  
  getAllReservations(sala:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/allReservas/${sala}`,{headers})
  }
  
}
