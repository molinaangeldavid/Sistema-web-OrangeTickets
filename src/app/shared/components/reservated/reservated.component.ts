import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { DataService } from '../../../core/services/data.service';
import { CookieService } from 'ngx-cookie-service';

interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-reservated',
  standalone: true,
  imports: [
    CommonModule,
    TableModule
  ],
  templateUrl: './reservated.component.html',
  styleUrl: './reservated.component.css'
})
export class ReservatedComponent {
  reserves: any
  
  cols!: Column[];
  
  dni: any | undefined

  constructor(
    private dataService:DataService,
    private cookieService: CookieService
  ) {}
  
  ngOnInit() {
    
    this.dni = this.cookieService.get('dni')

    this.cols = [
      { field: 'fila', header: 'Nº Fila' },
      { field: 'asiento', header: 'Nº Asiento' },
      { field: 'fecha', header: 'Fecha reserva' },
      { field: 'hora', header: 'Hora reserva' },
      { field: 'estado', header: 'Estado' }
    ];

    this.reserves = this.dataService.getData('jsonReservation')[this.dni]



  }
  
  
  
}
