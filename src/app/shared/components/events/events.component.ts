import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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


import { ConcertService } from '../../../core/services/concert.service';
import { ScenarioService } from '../../../core/services/scenario.service';
import { forkJoin } from 'rxjs';

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
  
  today: Date = new Date()
  fecha: any
  hora: any
  
  salas: any
  
  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private concertService: ConcertService,
    private scenarioService:ScenarioService
  ){
  }
  
  ngOnInit(){
    this.concert = {
      id: undefined,
      nombre: "",
      fecha: new Date(),
      hora: "",
      sala:undefined,
      valor: 0
    }
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
    this.fecha = new Date(this.concert.fecha)
    this.hora = this.concert.hora
    this.selectedSala = this.salas.find((s:any) => s.id == this.concert.sala)
    this.concertDialog = true;
  }
  
  deleteSelectedConcerts(){
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar estos concerts?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteObservables = this.selectedConcerts.map((element: any) => 
          this.concertService.deleteEvent(element.id, element)
      );
      
      forkJoin(deleteObservables).subscribe({
        next: (responses) => {
          console.log(responses);
          this.concerts = this.concerts.filter((val: any) => !this.selectedConcerts.includes(val));
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Todos los eventos seleccionados han sido eliminados', life: 3000 });
        },
        error: (error) => {
          console.log(error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al eliminar algunos eventos', life: 3000 });
        },
        complete: () => {
          this.selectedConcerts = null;
        }
      });
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
    this.submitted = true;
    if (this.concert!.nombre?.trim()) {
      if (this.concert!.id) {
        console.log(this.concert)
        this.concertService.putEvent(this.concert.id, this.concert).subscribe({
          next: (response) => {
            console.log(response)
          },
          error: (error) => {
            console.log(error)
          }
        })
        this.concerts[this.findIndexById(this.concert!.id)] = this.concert;
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert actualizado', life: 3000 });
      } else {
        this.concert!.id = this.createId();
        // dataConcerts[this.concert!.id] = this.copiaSala
        this.concert!.salaNombre = this.selectedSala.nombre
        this.concert!.sala = this.selectedSala.sala
        this.concert!.fecha = this.fecha;
        this.concert!.hora = this.getFormattedTime(this.hora);
        this.concerts.push(this.concert!);
        this.concertService.postEvent(this.concert).subscribe({
          next: (response) => {
            console.log(response)
          },
          error: (error) => {
            console.log(error)
          }
        })
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
        // let concertRemoved = this.concerts.filter((val: any) => val.id == concert.id)
        this.concertService.deleteEvent(concert.id,concert).subscribe({
          next: (response) => {
            console.log(response)
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert Eliminado', life: 3000 });
          },
          error: (error) => {
            console.log(error)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminarse el evento', life: 3000 });
          }
        })
        this.concerts = this.concerts.filter((val:any) => val.id !== concert.id);
        this.concert = {};
      }
    });
  }
  
}
