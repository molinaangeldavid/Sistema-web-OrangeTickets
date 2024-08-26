import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  apiUrl = environment.apiUrl
  path:any = `${this.apiUrl}/api/admin`

  pathUser:any = `${this.apiUrl}/api/estudiantes`

  constructor(private http: HttpClient,private authService: AuthService) { }

  getEventsUser(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.pathUser}/eventos`,{headers})
  }


  getEvents(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/eventos`,{headers})
  }

  postEvent(body:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.post<any>(`${this.path}/evento`,body,{headers})
  }

  putEvent(id:any, body:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.put<any>(`${this.path}/evento/${id}`,body,{headers})
  }

  deleteEvent(id:any,body:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.put<any>(`${this.path}/eventoEliminar/${id}`,body,{headers})
  }

}
