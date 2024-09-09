import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HistorialService {
  pathDir = environment.apiUrl

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }
  
  ////////////////////////////////////
  // Usuario
  createReserveHistorial(reserves:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.post(`${this.pathDir}/api/estudiantes/historial-reserva`,reserves,{headers})
  }
  ///////////////////////////
  // Admin
  getAllHistorial(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get(`${this.pathDir}/api/admin/historial`,{headers})
  }

  getAllTypeHistorial(type: any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get(`${this.pathDir}/api/admin/historial/${type}`,{headers})
  }

  confirmOrRemove(reserves:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.post(`${this.pathDir}/api/admin/historial-reservas`,reserves,{headers})
  }

}
