import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HabilitacionesService {

  constructor(
    private authService: AuthService,
    private http: HttpClient
  ) { }
  pathUrl = environment.apiUrl
  path: string = `${this.pathUrl}/api/admin`

  getAllHabilitation(){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/habilitaciones`,{headers})
  }

  getHabilitacionesFilter(evento_id:any,ciclo:any,anio:any,division:any){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.get<any>(`${this.path}/habilitaciones/${evento_id}/${ciclo}/${anio}/${division}`,{headers})
  }

  postHabilitacion(evento_id:any,body: any){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    })
    return this.http.post<any>(`${this.path}/habilitaciones/${evento_id}`,body,{headers})
  }
}


