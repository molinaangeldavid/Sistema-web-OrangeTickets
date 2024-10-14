import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HistorialService } from '../../../core/services/historial.service';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { ConcertService } from '../../../core/services/concert.service';
import { TipoHistoriaPipe } from "../../pipes/tipo-historia.pipe";

@Component({
  selector: 'app-historial-reserves',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    DialogModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    TipoHistoriaPipe
],
  templateUrl: './historial-reserves.component.html',
  styleUrl: './historial-reserves.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class HistorialReservesComponent {

  dialogVisible = false

  historial: any

  tipos: any = [{nombre: "Nueva Reserva",tipo:'creaciones'},
    {nombre: "Reserva Eliminada",tipo:'eliminaciones'}, 
    {nombre: "Reserva Confirmada",tipo:'confirmaciones'}]
  tipoChoice: any

  dniFilter:any

  admin: any

  date: any

  historialSelected: any

  showTable: any = false

  usuarios: any = [{usuario: 'Estudiante',admin:false}, {usuario: 'Administrador',admin:true}]
  usuarioChoice: any
  
  concerts: any
  constructor(
    private historialService: HistorialService,
    private concertService: ConcertService
  ){
    
  }

  
  ngOnInit(){
    this.usuarioChoice = undefined
    this.tipoChoice = undefined

    this.historialService.getAllHistorial().subscribe({
      next: (response) => {
        if (Array.isArray(response) && response.length > 0) {
          this.historial = response;
          this.showTable = true
        } else {
          // Si no es un array, inicializamos this.historial como vacío
          this.historial = [];
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
    this.concertService.getEvents().subscribe({
      next: (response) => {
        this.concerts = response
      },
      error: (error) => {
        console.log(error)
      }
    })
  }


  formatDateToDDMMYYYY(date: Date): string {
    const day = date.getUTCDate().toString().padStart(2, '0'); // Día en formato de 2 dígitos
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Mes en formato de 2 dígitos, UTCMonth devuelve de 0-11
    const year = date.getUTCFullYear().toString(); // Año completo
  
    return `${day}/${month}/${year}`;
  }

  getDetailConcert(id:any){
    const evento = this.concerts.find((eve:any) => eve.id == id)
    return `${evento.nombre} ${this.formatDateToDDMMYYYY(evento.fecha)} ${evento.hora}`
  }

  resetFilters() {
    this.tipoChoice = null; 
    this.dniFilter = '';  
    this.usuarioChoice = null;
    this.date = null;  
}

  buscar(){
    const params:any = {}
    if (this.tipoChoice?.tipo) {
      params.tipo = this.tipoChoice.tipo;
    }
    
    if (this.dniFilter) {
      params.dni = this.dniFilter;
    }
  
    if (this.usuarioChoice?.admin) {
      params.admin = this.usuarioChoice.admin;
    }
  
    if (this.date) {
      params.fecha = this.date;
    }
    console.log(params)
    this.historialService.getFilterHistorial(params).subscribe({
      next:(response) => {
        if (Array.isArray(response)) {
          this.historial = response;
          this.showTable = true
        } else {
          // Si no es un array, inicializamos this.historial como vacío
          this.historial = [];
          this.showTable = false
          console.error("La respuesta no es un array:", response);
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  openDialog(reservas:any){
    this.dialogVisible = true
    this.historialSelected = reservas
  }

}
