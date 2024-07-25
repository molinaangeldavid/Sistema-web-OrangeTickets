import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  path: any = "http://localhost:3000"

  constructor(
    private http: HttpClient
  ) { }



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
