import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShowComponentService {

  private componentEvent:Subject<string> = new Subject<string>();
  componentEvent$ = this.componentEvent.asObservable();

  constructor() { }

  triggerComponentEvent(componentName: string){
    console.log(componentName)
    this.componentEvent.next(componentName)
    
  }



}
