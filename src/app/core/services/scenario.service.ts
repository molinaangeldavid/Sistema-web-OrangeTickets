import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  private updateScenarioSource = new BehaviorSubject<any>(null);
  updateScenario$ = this.updateScenarioSource.asObservable();
  
  pathScenario: string = '../../../assets/escenario.json'
  // pathScenario2: string = '../../../assets/escenario2.json'



  constructor(private http: HttpClient) { 
  }
  
  getScenario(): Observable<any>{
    return this.http.get(this.pathScenario)
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
