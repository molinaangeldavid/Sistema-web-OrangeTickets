import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = environment.apiUrl
  path: any = `${this.apiUrl}`
  tokenEstudiante: any
  tokenAdmin: any

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.loadTokens()
   }

   private loadTokens() {
    this.tokenEstudiante = this.cookieService.get('tokenEstudiante');
    this.tokenAdmin = this.cookieService.get('tokenAdmin');
  }

  getTokenAdmin(): string {
    if (!this.tokenAdmin) {
      this.loadTokens();
    }
    return this.tokenAdmin;
  }
  getTokenEstudiante(): string {
    if (!this.tokenEstudiante) {
      this.loadTokens();
    }
    return this.tokenEstudiante;
  }

  authUser(dni:any): Observable<any>{
    return this.http.post<any>(`${this.path}/api/estudiantes/login`,{dni})
  }

  authAdmin(dni:any,pass:any): Observable<any> {
    return this.http.post<any>(`${this.path}/api/admin/login`,{dni,pass});
  }


  

}
