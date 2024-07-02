import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../core/services/usuario.service';

@Component({
  selector: 'app-reservation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent {
  
  salas: any[]|undefined
  concerts: any[]|undefined
  cantidad: any | undefined
  salaSelected: any | undefined
  concertSelected: any | undefined
  
  constructor(
    private userService: UsuarioService
  ){
    
  }
  
  ngOnInit(){
    this.salas = ['Kinder']
    this.concerts = ['La Cage Aux Queens']
    this.cantidad = ''
  }
  
  reservar(){
    console.log(this.salaSelected)
    console.log(this.cantidad)
    console.log(this.concertSelected)
    // this.userService.setReservaInfo(this.salaSelected,this.cantidad,this.concertSelected)
  }
  
}


