import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  path: any = "http://localhost:3000"
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
  // getDatos(): Observable<any> {
  //   return this.http.get<any>('../../../assets/usuario.json');
  // }

  // getUser(dni:any): Observable<any>{
  //   return this.http.get<any>('../../../assets/usuario.json').pipe(
  //     map(value => value.usuarios.find((user:any)=> dni == user.dni))
  //   )
  // }

  authUser(dni:any): Observable<any>{
    return this.http.post<any>(`${this.path}/api/estudiantes/login`,{dni})
  }

  authAdmin(dni:any,pass:any): Observable<any> {
    return this.http.post<any>(`${this.path}/api/admin/login`,{dni,pass});
  }


  

}
