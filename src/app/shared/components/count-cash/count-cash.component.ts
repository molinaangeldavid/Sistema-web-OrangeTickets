import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { DataService } from '../../../core/services/data.service';

import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';


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
    ButtonModule
  ],
  templateUrl: './count-cash.component.html',
  styleUrl: './count-cash.component.css'
})
export class CountCashComponent {
  
  byDays: any[] = [{fecha:"09-7-2024",total: 60000},{fecha: '10-7-2024',total:90000}]
  
  byConcerts: any

  confirmation: any
  
  byUsers: any
  dateNow: any

  showUser: boolean | undefined
  showDate: boolean = false
  showConcert: boolean = false

  concerts: any

  result:any = []

  constructor(
    private dataService: DataService,
    private http: HttpClient
  ){

  }
  
  ngOnInit(){
    this.confirmation = this.dataService.getData('jsonConfirm')
    this.concerts = this.dataService.getData('jsonConcerts')
    this.calculateConfirmationsAndTotals();
    this.showUser = true
    this.dateNow = this.getDateNow()
    this.byUsers = this.usersCount()
  }

  calculateConfirmationsAndTotals(): void {
    // Objeto para contar confirmaciones
    const confirmationCounts: { [key: string]: number } = {};

    // Recorrer todas las confirmaciones y contar por concierto
    for (const key in this.confirmation) {
      if (this.confirmation.hasOwnProperty(key)) {
        const confirmations = this.confirmation[key];
        confirmations.forEach((c: any) => {
          const concertName = c.concert;
          if (!confirmationCounts[concertName]) {
            confirmationCounts[concertName] = 0;
          }
          confirmationCounts[concertName]++;
        });
      }
    }

    // Crear el resultado final con id, nombre y total
    for (const concertId in this.concerts) {
      if (this.concerts.hasOwnProperty(concertId)) {
        const concert = this.concerts[concertId];
        const concertName = concert.nombre;
        const count = confirmationCounts[concertName] || 0;
        const total = count * concert.valor;
        if (count > 0) {
          this.result.push({ id: concert.id, nombre: concertName, total: total });
        }
      }
    }
  }

  getDateNow(){
    const now = new Date();
    
    const currentDate = `${this.padNumber(now.getDate())}-${this.padNumber(now.getMonth() + 1)}-${now.getFullYear()}`;
    const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
    return [currentDate,currentTime,`${this.padNumber(now.getDate())}-${this.padNumber(now.getMonth() + 1)}`]
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  usersCount(){
    const users = this.dataService.getData('jsonUsers').usuarios
    let resultado = users.map((usuario:any) => {
      let reservas = this.confirmation[usuario.dni] || [];
      let totalReservas = reservas.length * 10000;
      return {
          dni: usuario.dni,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          total: totalReservas
      };
    });
    return resultado
  }
  concertCount(){

  }
  dayCount(){

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
  }

}
