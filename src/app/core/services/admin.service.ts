import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  path:any = 'http://localhost:3000/api/admin'

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  getAllUsers(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/usuarios`,{headers})
  }
  getAdmins(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/administradores`,{headers})
  }
  getAdminByDni(dni:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/administradores/${dni}`,{headers})
  }

  postAdmin(body:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.post<any>(`${this.path}/administradores`,body,{headers})
  }
  putAdmin(dni:any,body:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.put<any>(`${this.path}/administradores/${dni}`,body,{headers})
  }
  deleteAdmin(dni:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.delete<any>(`${this.path}/administradores/${dni}`,{headers})
  }
}
