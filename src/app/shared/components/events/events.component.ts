import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';


import { DataService } from '../../../core/services/data.service';
import { ConcertService } from '../../../core/services/concert.service';
import { ScenarioService } from '../../../core/services/scenario.service';

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
    InputNumberModule,
    DropdownModule
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
  providers: [MessageService,ConfirmationService]
})
export class EventsComponent {
  
  concerts: any | undefined
  
  concert: any | undefined
  
  selectedConcerts!: any | null;
  
  concertDialog: boolean = false
  
  submitted: boolean = false
  
  selectedSala:any

  fecha: any
  hora: any
  
  salas: any

  constructor(
    private dataService: DataService,
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private concertService: ConcertService,
    private scenarioService:ScenarioService
  ){
  }
  
  ngOnInit(){
    this.concertService.getEvents().subscribe(e => {
      this.scenarioService.getSalasAdmin().subscribe(salas => {
        this.salas = salas
        this.concerts = e.map((c:any) => ({
          ...c,
          salaNombre: this.getSalaNombre(c.sala)
        }))
      })
    })
  }
  
  getSalaNombre(salaId: number): string {
    const sala = this.salas.find((s:any) => s.sala === salaId);
    return sala ? sala.nombre : 'Sala desconocida';
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
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar estos concerts?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.concerts = this.concerts.filter((val:any) => !this.selectedConcerts?.includes(val));
          this.selectedConcerts = null;
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concerts eliminados', life: 3000 });
      }
  });
    
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
        maxId = parseInt(concert.id);
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
        const dataConcerts = this.dataService.getData('jsonData')
        this.concert!.id = this.createId();
        // dataConcerts[this.concert!.id] = this.copiaSala
        this.concert!.sala = this.concert!.id
        this.concert!.fecha = this.getFormattedDate(this.fecha);
        this.concert!.hora = this.getFormattedTime(this.hora);
        this.concerts.push(this.concert!);
        this.dataService.saveData('jsonData',dataConcerts)
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
        let concertRemoved = this.concerts.filter((val: any) => val.id == concert.id)
        let data = this.dataService.getData('jsonData')
        delete data[concertRemoved.sala]
        this.dataService.saveData('jsonData',data)
        this.concerts = this.concerts.filter((val:any) => val.id !== concert.id);
        
        this.dataService.saveData('jsonConcerts',{"concerts": this.concerts})
        this.concert = {};
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert Eliminado', life: 3000 });
      }
    });
  }
  
}
