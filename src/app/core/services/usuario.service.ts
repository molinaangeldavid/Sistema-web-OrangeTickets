import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: any

  // path:any = '../../../assets/usuario.json'
  path: any = "http://localhost:3000"

  token: any

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService
  ) { 
  }

  // getDni(){
  //   return this.usuario
  // }
  
  // setDni(value:string){
  //   this.usuario = value
  // }
  
  getHabilitation(dni:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/estudiante/${dni}`,{headers})
  }

  getAllUsers(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/api/admin/usuarios`,{headers})
  }
}
