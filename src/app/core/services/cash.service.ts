import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CashService {

  pathAdmin: string = 'http://localhost:3000'
  headers: HttpHeaders = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`
  });
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  controlCaja(body:any): Observable<any>{
    const headers = this.headers
    return this.http.post(`${this.pathAdmin}/api/admin/estadoreservas`,body,{headers})
  }
}
