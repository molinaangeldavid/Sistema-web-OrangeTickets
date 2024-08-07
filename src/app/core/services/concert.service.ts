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

  // getDatos(): Observable<any> {
  //   return this.http.get<any>('../../../assets/concert.json');
  // }

  getEvents(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/eventos`,{headers})
  }


}
