import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  pathUrl = environment.apiUrl

  private updateScenarioSource = new BehaviorSubject<any>(false);
  updateScenario$ = this.updateScenarioSource.asObservable();

  path: any = `${this.pathUrl}`

  // evento: 
  constructor(
    private http: HttpClient, 
    private authService:AuthService
  ) { 
  }
  
  getScenario(evento:any,evento_id:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/estudiantes/sala/${evento}/${evento_id}`,{headers})
  }
  getScenarioAdmin(evento:any,evento_id:any): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/admin/sala/${evento}/${evento_id}`,{headers})
  }
  getSalasAdmin(): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}` 
    });
    return this.http.get<any>(`${this.path}/api/admin/salas`,{headers})
  }

  notifyScenarioUpdate() {
    this.updateScenarioSource.next(true);
  }
  
}
