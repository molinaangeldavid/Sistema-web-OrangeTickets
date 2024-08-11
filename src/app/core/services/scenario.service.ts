import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private updateScenarioSource = new BehaviorSubject<any>(false);
  updateScenario$ = this.updateScenarioSource.asObservable();

  path: any = 'http://localhost:3000'

  // evento: 
  constructor(
    private http: HttpClient, 
    private authService:AuthService
  ) { 
  }
  
  getScenario(evento:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/sala/${evento}`,{headers})
  }
  getScenarioAdmin(evento:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/admin/sala/${evento}`,{headers})
  }

  notifyScenarioUpdate() {
    this.updateScenarioSource.next(true);
  }
  
}
