import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ElementRefService {

  private elements: { 
    [key:string]: HTMLElement
  } = {}

  constructor() { }

  setElement(key:string,element:HTMLElement){
    this.elements[key] = element
  }

  getElement(key:string): HTMLElement | undefined {
    return this.elements[key]
  }
}
