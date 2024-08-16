import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ConcertService {

  path:any = 'http://localhost:3000/api/admin'

  constructor(private http: HttpClient,private authService: AuthService) { }

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

  putEvent(body:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.put<any>(`${this.path}/evento`,body,{headers})
  }

  deleteEvent(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.delete<any>(`${this.path}/evento`,{headers})
  }

}
