import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  // path:any = '../../../assets/usuario.json'
  path: any = "http://localhost:3000"

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { 
  }
  
  getHabilitation(dni:any):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/estudiante/${dni}`,{headers})
  }

}
