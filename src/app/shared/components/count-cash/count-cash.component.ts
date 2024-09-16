import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { CashService } from '../../../core/services/cash.service';
import { DropdownModule } from 'primeng/dropdown';
import { ConcertService } from '../../../core/services/concert.service';

@Component({ 
  selector: 'app-count-cash',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ChartModule,
    ButtonModule,
    CalendarModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './count-cash.component.html',
  styleUrl: './count-cash.component.css'
})
export class CountCashComponent {
  byDate: any
  byConcerts: any
  totalByUsers: any
  
  confirmation: any
  
  byUsers: any
  dateNow: any
  datebeforeNow: any
  
  showUser: boolean | undefined = true
  showDate: boolean = false
  desde: Date | undefined
  hasta: Date | undefined
  
  showConcert: boolean = false
  
  concerts: any
  eventSelected: any
  events: any
  
  result:any = []
  
  filter: any = {
    ciclo:"",
    anio:"",
    division: "",
    estado: "pagado",
    desde: "",
    hasta:"",
    dni:"",
    evento_id: "",
    agrupado: false
  }
  
  constructor(
    private cashService: CashService,
    private concertService: ConcertService
  ){
  }
  
  ngOnInit(){
    this.showByUser()
    this.dateNow = new Date()
    this.concertService.getEvents().subscribe(data =>{
      this.events = data
    });
  }
  
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
  
  onHastaChange(event: any) {
    if (this.hasta) {
      // Verificar si la fecha "Hasta" es hoy
      if (this.isToday(this.hasta)) {
        // Si la fecha "Hasta" es hoy, ajustar la fecha y hora actuales
        this.hasta = new Date(); // Ajustar a la fecha y hora actuales
        this.desde = this.dateNow; // Ajustar "Desde" a la fecha y hora actuales
      } else {
        // Si la fecha "Hasta" no es hoy, ajustar "Desde" al día anterior de "Hasta"
        const newDesde = new Date(this.hasta);
        newDesde.setDate(newDesde.getDate() - 1); // Establecer la fecha de "Desde" al día anterior de "Hasta"
        if (!this.desde || this.desde < newDesde) {
          this.desde = newDesde;
        }
      }
    }
  }
  
  getEventName(id: any){
    const name = this.events.find((e:any) => e.id == id).nombre
    return name
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  groupByDni(data:any){
    const groupedByDni = data.reduce((acc:any, current:any) => {
      const { dni, nombre, apellido, valor } = current;
      
      // Si el dni no está en el acumulador, lo agregamos con los campos requeridos
      if (!acc[dni]) {
        acc[dni] = { dni, nombre, apellido, totalValor: 0 };
      }
      
      // Incrementamos el valor total y la cantidad de documentos para este dni
      acc[dni].totalValor += valor;
      acc[dni].cantidad += 1;
      
      return acc;
    }, {});
    return groupedByDni
  }
  
  groupByDate(data:any){
    const groupedByDate = data.reduce((acc:any, item:any) => {
      const fechaUTC = new Date(item.fechaAdmin);
      const fechaArgentina = new Date(fechaUTC.getTime() - 3 * 60 * 60 * 1000);
      
      // Formatear la fecha como 'YYYY-MM-DD'
      const fecha = fechaArgentina.toISOString().split('T')[0];
      
      if (!acc[fecha]) {
        acc[fecha] = { fecha, total: 0 };
      }
      
      acc[fecha].total += item.valor;
      return acc;
    }, {});
    return groupedByDate
  }
  
  groupByConcert(data:any){
    const groupByConcert = data.reduce((acc:any, current:any) => {
      // Si el evento_id no existe en el acumulador, lo inicializamos
      const {evento_id,valor} = current
      if (!acc[evento_id]) {
        acc[evento_id] = {evento_id, totalValor: 0};
      }
      // Añadimos el current al grupo correspondiente
      acc[evento_id].totalValor += valor;

      return acc;
    }, {});
    return groupByConcert
  }

  searchFecha(){
    if (this.desde != null || this.hasta != null) {
      // Lógica para realizar la búsqueda
      this.filter.desde = this.desde
      this.cashService.controlCaja(this.filter).subscribe(response => {
        const group = this.groupByDate(response)
        this.byDate = Object.values(group)
      });
      console.log('Fecha válida para búsqueda:', this.desde?.toISOString(), this.hasta?.toISOString());
    } else {
      alert('Debes Seleccionar al menos una fecha')
    }
    this.filter.desde = ""
    this.filter.hasta = ""
  }
  
  showByUser(){
    if(this.showDate){
      this.showDate = false
    }else {
      if(this.showConcert){
        this.showConcert = false
      }
    }
    this.showUser = true
    this.cashService.controlCaja(this.filter).subscribe(response => {
      const group = this.groupByDni(response)
      this.byUsers = Object.values(group);
      this.totalByUsers = this.byUsers.reduce((sum:any, user:any) => sum + user.totalValor, 0);
    })
  }
  
  showByDate(){
    if(this.showUser){
      this.showUser = false
    }else {
      if(this.showConcert){
        this.showConcert = false
      }
    }
    this.showDate = true
    this.cashService.controlCaja(this.filter).subscribe(response => {
      const group = this.groupByDate(response);
      this.byDate = Object.values(group);
    });
  }
  
  showByConcert(){
    if(this.showUser){
      this.showUser = false
    }else {
      if(this.showDate){
        this.showDate = false
      }
    }
    this.showConcert = true
    this.cashService.controlCaja(this.filter).subscribe(data => {
      const concerts = this.groupByConcert(data)
      this.byConcerts = Object.values(concerts)
    })
  }
  
}
