import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  pathUrl = environment.apiUrl

  path: any = `${this.pathUrl}`

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
