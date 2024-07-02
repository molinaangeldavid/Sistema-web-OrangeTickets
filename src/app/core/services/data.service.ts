import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private storageScenario = 'jsonData';
  // private storageReserve = 'jsonReserve'


  constructor() { 
  }
  // Método para obtener los datos JSON
  getData(keyStorage:any): any {
    const data = localStorage.getItem(keyStorage);
    return data ? JSON.parse(data) : null;
  }

  // Método para guardar los datos JSON
  saveData(keyStorage:any,data: any): void {
    localStorage.setItem(keyStorage, JSON.stringify(data));
  }

  

}
