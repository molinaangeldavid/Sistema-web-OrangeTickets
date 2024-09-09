import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  apiUrl = environment.apiUrl;
  path:any = `${this.apiUrl}/api/admin`

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
  getAllEstudiantes(ciclo: string,anio: string, division: string,dni:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    
    return this.http.get<any>(`${this.path}/allEstudiantes/${ciclo}/${anio}/${division}/${dni}`,{headers})
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
  // Cargar usuarios
  uploadUser(file:File): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    const formData = new FormData();
    formData.append('file',file,file.name);
    return this.http.post(`${this.path}/subirUsuarios`,formData,{headers})
  }
  // Administracion de administradores
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
