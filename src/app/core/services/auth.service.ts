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
  token: any

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) {
    this.loadToken()
   }

  private loadToken() {
    this.token = this.cookieService.get('token');
  }

  getToken(): string {
    if (!this.token) {
      this.loadToken();
    }
    return this.token;
  }

  authUser(dni:any): Observable<any>{
    return this.http.post<any>(`${this.path}/api/estudiantes/login`,{dni})
  }

  authAdmin(dni:any,pass:any): Observable<any> {
    return this.http.post<any>(`${this.path}/api/admin/login`,{dni,pass});
  }


  

}
