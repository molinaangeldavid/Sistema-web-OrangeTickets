import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private updateScenarioSource = new BehaviorSubject<any>(null);
  updateScenario$ = this.updateScenarioSource.asObservable();
  
  // pathScenario: string = '../../../assets/escenario.json'

  path: any = 'http://localhost:3000'
  // evento: 
  constructor(
    private http: HttpClient, 
    private cookieService: CookieService,
    private authService:AuthService
  ) { 
  }

  // getScenario(): Observable<any>{
  //   return this.http.get(this.pathScenario)
  // }
  
  getScenario(evento:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/sala/${evento}`,{headers})
  }

  notifyScenarioUpdate(data: any) {
    this.updateScenarioSource.next(data);
  }

  sendScenario(scenario:any){ 
    return scenario
  }

  // getScenario2(): Observable<any>{
  //   return this.http.get(this.pathScenario2)
  // }
  
  // putScenario(body: any): Observable<any>{  
  //   const headers = new HttpHeaders({'Content-Type':'application/json'})
  //   return this.http.post(this.pathScenario,body,{headers})
  // }
  
  // postReserve(seats: any): Observable<any>{
  //   const headers = new HttpHeaders({'Content-Type':'application/json'})
  //   return this.http.post(this.pathReserve,seats,{headers})
  // }
  
  // putReserve(seat: any): Observable<any>{
  //   const headers = new HttpHeaders({'Content-Type':'application/json'})
  //   return this.http.put(this.pathReserve,seat,{headers})
  // }
  
}
