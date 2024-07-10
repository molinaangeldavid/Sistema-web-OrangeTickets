import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  // private storageScenario = 'jsonData';
  // private storageReserve = 'jsonReserve'

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Método para obtener los datos JSON
  getData(keyStorage:any): any {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(keyStorage);
      return data ? JSON.parse(data) : null;
    } else {
      console.warn('localStorage is not available');
      return null
    }
  }

  // Método para guardar los datos JSON
  saveData(keyStorage:any,data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keyStorage, JSON.stringify(data));
    } else {
      console.warn('localStorage is not available');
    }
  }

  

}
