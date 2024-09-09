import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HistorialService } from '../../../core/services/historial.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-historial-reserves',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './historial-reserves.component.html',
  styleUrl: './historial-reserves.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class HistorialReservesComponent {

  historial: any

  tipoSelected: any
  constructor(
    private historialService: HistorialService
  ){
    
  }

  ngOnInit(){

    this.historialService.getAllHistorial().subscribe(value => {
      this.historial = value
    })

  }

  openDialog(){

  }

}
