import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  path:any = 'http://localhost:3000/api/admin'

  pathUser:any = 'http://localhost:3000/api/estudiantes'

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
