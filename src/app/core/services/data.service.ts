import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  // Método para obtener los datos JSON
  getData(keyStorage:any): any {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem(keyStorage);
      return data ? JSON.parse(data) : null;
    } else {
      return null
    }
  }

  // Método para guardar los datos JSON
  saveData(keyStorage:any,data: any): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(keyStorage, JSON.stringify(data));
    } 
  }

  deleteData(keyStorage: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(keyStorage);
    }
  }

  // Método para eliminar todos los datos
  deleteAllData(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
  }

  

}
