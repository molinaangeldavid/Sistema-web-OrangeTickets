import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: any

  // sala: any
  // cantidadReservas: any
  // concert: any
  path:any = '../../../assets/usuario.json'
  dataConcert: any

  dataUsuario: any

  constructor(
  ) { }

  getDni(){
    return this.usuario
  }
  
  setDni(value:string){
    this.usuario = value
  }

  // getReservaInfo(){
  //   return {
  //     sala: this.sala,
  //     cantidad: this.cantidadReservas,
  //     concert: this.concert
  //   }
  // }           
  
  getData(): any{
    
  }

}
