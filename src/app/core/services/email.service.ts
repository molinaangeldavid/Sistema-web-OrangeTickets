import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  pathEnv = environment.apiUrl
  path: any = `${this.pathEnv}/api/estudiantes`

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  sendEmail(from:any,to:any, subject:any, html:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getTokenEstudiante()}`
    })
    return this.http.post(`${this.path}/enviar-email`, {from,to,subject,html}, {headers})
  }



}
