import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  
  pathUrl = environment.apiUrl

  token: any
  
  path: any = `${this.pathUrl}/api/estudiantes`
  pathAdmin: any = `${this.pathUrl}/api/admin`

  headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
  }

  // Peticiones http del estudiante
  getReservation(dni: any):Observable<any>{
    const headers = this.headers
    return this.http.get<any>(`${this.path}/reservas/${dni}`,{headers})
  }
  getAllReservations(sala:any): Observable<any>{
    const headers = this.headers
    return this.http.get<any>(`${this.path}/allReservas/${sala}`,{headers})
  }

  postReservations(dni:any,reserves:any): Observable<any>{
    const headers = this.headers
    return this.http.put<any>(`${this.path}/reservas/${dni}`,reserves,{headers})
  }

  checkSeatAvailable(evento_id:any,seats:any): Observable<any>{
    const headers = this.headers
    return this.http.post<any>(`${this.path}/check-seat-available`,{
      evento_id,
      seats
    }, {headers});
  }



  // ===========================================
  // ===================================================
  // Peticiones http del admin
  getReservationAdmin(dni: any):Observable<any>{
    const headers = this.headers
    return this.http.get<any>(`${this.pathAdmin}/reservas/${dni}`,{headers})
  }
  
  getAllReservationsAdmin(sala:any): Observable<any>{
    const headers = this.headers
    return this.http.get<any>(`${this.pathAdmin}/allReservas/${sala}`,{headers})
  }

  confirmReserves(selectedReserves:any):Observable<any>{
    const headers = this.headers
    return this.http.put<any>(`${this.pathAdmin}/reservas/reservado/pagado`,selectedReserves,{headers})
  }

  deleteReserves(selectedReserves:any):Observable<any>{
    const headers = this.headers
    return this.http.put<any>(`${this.pathAdmin}/reservas/reservado/disponible`,selectedReserves,{headers})
  }

}
