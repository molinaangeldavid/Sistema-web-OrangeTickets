import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfirmadoService {

  constructor(
    private http: HttpClient
  ) { }

  getDatos(): Observable<any> {
    return this.http.get<any>('../../../assets/confirmados.json');
  }
}
