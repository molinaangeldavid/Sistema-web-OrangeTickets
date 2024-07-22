import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';


import { DataService } from '../../../core/services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';

interface Concert{
  id?: string,
  nombre?: string,
  sala?: string,
  nombreSala?: string,
  fecha?: string,
  hora?: string,
  teatro?: string,
  valor?: number
}


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToolbarModule,
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [MessageService,ConfirmationService]
})
export class EventsComponent {
  
  concerts: any | undefined
  
  concert: Concert | undefined
  
  selectedConcerts!: any | null;
  
  concertDialog: boolean = false
  
  submitted: boolean = false
  
  
  fecha: any
  hora: any
  
  constructor(
    private dataService: DataService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService
  ){
  }
  
  ngOnInit(){
    this.concerts = this.dataService.getData('jsonConcerts')["concerts"]
    this.concert = {
      id: undefined,
      nombre: "",
      nombreSala: "Pablo Neruda",
      fecha:"",
      hora:"",
      teatro:"Paseo La Plaza",
      valor:0
    }
    this.concert ={}
  }
  
  new(){
    this.concert = {};
    this.submitted = false;
    this.concertDialog = true;
  }
  
  editConcert(concert:any){
    this.concert = { ...concert };
    this.concertDialog = true;
  }
  
  deleteSelectedConcerts(){
    
    
  }
  
  findIndexById(id: string): number {
    let index = -1;
    for (let i = 0; i < this.concerts.length; i++) {
      if (this.concerts[i].id === id) {
        index = i;
        break;
      }
    }
    
    return index;
  }
  
  createId(): string {
    let maxId = 0;
    for (const concert of this.concerts) {
      if (concert.id > maxId) {
        maxId = concert.id;
      }
    }
    return `${maxId + 1}`;
  }
  
  getFormattedDate(date: Date): string {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Método para formatear la hora a hh:mm
  getFormattedTime(time: Date): string {
    const hours = ('0' + time.getHours()).slice(-2);
    const minutes = ('0' + time.getMinutes()).slice(-2);
    return `${hours}:${minutes}`;
  }
  saveConcert(){
    this.concert!.nombreSala = "Pablo Neruda"
    this.concert!.teatro = "Paseo la Plaza"
    console.log(this.concert?.nombreSala)
    this.submitted = true;
    
    if (this.concert!.nombre?.trim()) {
      if (this.concert!.id) {
        this.concert!.fecha = this.getFormattedDate(this.fecha);
        this.concert!.hora = this.getFormattedTime(this.hora);
        this.concerts[this.findIndexById(this.concert!.id)] = this.concert;
        this.dataService.saveData('jsonConcerts',{"concerts":this.concerts})
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert actualizado', life: 3000 });
      } else {
        this.concert!.id = this.createId();
        this.concert!.fecha = this.getFormattedDate(this.fecha);
        this.concert!.hora = this.getFormattedTime(this.hora);
        this.concerts.push(this.concert!);
        this.dataService.saveData('jsonConcerts',{"concerts":this.concerts})
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert creado', life: 3000 });
      }
      
      this.concerts = [...this.concerts];
      this.concertDialog = false;
      this.concert! = {};
    }
  }
  hideDialog() {
    this.concertDialog = false;
    this.submitted = false;
  }
  deleteConcert(concert: any) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + concert.nombre + ' ?',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.concerts = this.concerts.filter((val:any) => val.id !== concert.id);
        
        this.dataService.saveData('jsonConcerts',{"concerts": this.concerts})
        this.concert = {};
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert Eliminado', life: 3000 });
      }
    });
  }
  
}
