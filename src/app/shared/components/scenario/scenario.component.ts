import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,Component, EventEmitter, Input, Output, OnInit, SimpleChanges, ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';


import { forkJoin, lastValueFrom, Subscription, switchMap, tap, throwError } from 'rxjs';

import { ScenarioService } from '../../../core/services/scenario.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { DataService } from '../../../core/services/data.service';
import { EmailService } from '../../../core/services/email.service';
import { HistorialService } from '../../../core/services/historial.service';
import { HabilitacionesService } from '../../../core/services/habilitaciones.service';

import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-scenario',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './scenario.component.html',
  styleUrl: './scenario.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA],
})
export class ScenarioComponent implements OnInit{
  
  private subscription!: Subscription;
  
  loading: any
  
  @Input() escenario: any
  @Input() admin:boolean | undefined
  @Input() habilitation: any
  
  @Output() changePage = new EventEmitter<string>()
  
  // Carga de los 3 conciertos - salas
  seats: any | undefined
  // Los asientos que son seleccionados
  selectedSeats: Set<string> = new Set();
  seatOrder: any[] = []
  // La data de todas las reservas
  reservation: any | undefined
  // La data de las reservas de solo el usuario(DNI)
  reservationDni: any
  // El dni del usuario
  dni: any
  // boton desactivo
  isDisabled: boolean | undefined
  // Todos los usuarios
  user: any | undefined
  
  total: any = 0
  
  isReservationAllowed: boolean | undefined;
  
  constructor(
    private scenarioService: ScenarioService,
    private reservationService: ReservationService,
    private dataService: DataService,
    private emailService: EmailService,
    private historialService: HistorialService,
    private habilitationService: HabilitacionesService,
    private cdr: ChangeDetectorRef
  ){
  }
  
  async ngOnInit(){
    this.loading = true
    if(this.admin){
      this.dni = this.dataService.getData('dniAdmin')
    }else{
      this.dni = this.dataService.getData('dni')
    }
    this.user = this.dataService.getData('data')
    if(this.habilitation && this.habilitation.cantidad > 0){
      this.isReservationAllowed = true
    }else{
      this.isReservationAllowed = false
    }
    
    this.subscription = this.scenarioService.updateScenario$.subscribe(() => {
      this.refreshScenario()
    });
    await this.loadScenario()
    
  }
  
  async loadScenario(){
    try {
      if(!this.admin){
        this.seats = await lastValueFrom(this.scenarioService.getScenario(this.escenario.sala,this.escenario.id))
      }
      if(this.admin){
        this.seats = await lastValueFrom(this.scenarioService.getScenarioAdmin(this.escenario.sala,this.escenario.id))
      }
    } catch (error) {
      console.error('Error al cargar datos', error)
    }
    finally{
      this.loading = false
    }
  }
  
  private async refreshScenario(){
    this.loading = true;
    await this.loadScenario()
  }
  
  async ngOnChanges(changes:SimpleChanges){
    if(changes['escenario'] && changes['escenario'].currentValue){
      try {
        this.subscription = this.scenarioService.updateScenario$.subscribe(() => {
          this.refreshScenario()
        });
        await this.loadScenario()
      } catch (error) {
        console.error('Error al cargar datos', error)
      }
      finally{
        this.loading = false
      }
    }
  }
  
  getSeatKey(rowIndex: number, seatIndex: number): string {
    return `${rowIndex}-${seatIndex}`;
  }
  
  async toggleSeatSelection(row:any,seat:any,tipo:any){
    const seatKey = this.getSeatKey(row, seat);
    if (this.selectedSeats.has(seatKey)) {
      this.selectedSeats.delete(seatKey);
      this.total -= this.escenario.valor
    } else {
      if (this.selectedSeats.size >= this.habilitation.cantidad) {
        alert("No puede seleccionar mas asientos. Pruebe mas tarde")
        return;
      }
      this.selectedSeats.add(seatKey);
      this.total += this.escenario.valor
    }
    this.cdr.detectChanges();
  }

  isAvailable(seat:any){
    return !this.isReservated(seat) && !this.isPaid(seat)
  }
  
  isSelected(row: any, seat: any): boolean{
    return this.selectedSeats.has(this.getSeatKey(row, seat));
  }
  // Este es la funcion que permite mostrar los asientos
  existSeat(seat:any):boolean{
    return seat.fila != 0 || seat.butaca != '0'
  }
  
  isReservated(seat:any):boolean{
    return seat.estado == "reservado"
  }
  
  isPaid(seat: any):boolean{
    return seat.estado == "pagado"
  }
  
  mySeat(seat: any):boolean {
    return seat.dni == this.dni
  }
  
  isDisabledSeat(seat: any){
    if(seat.tipo == 'd'){
      return true
    }
    return false
  }
  
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  getTime():any{
    const now = new Date();
    const currentDate = `${now.getFullYear()}-${this.padNumber(now.getMonth() + 1)}-${this.padNumber(now.getDate())}`;
    const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
    
    return {
      currentDate,
      currentTime,
      
      day: this.padNumber(now.getDate()),
      hour: this.padNumber(now.getHours()),
      minutes: this.padNumber(now.getMinutes())
    }
  }
  
  configEmail(reservas: any){
    
    const from = "ticketsOrange@orangeinternational.edu.ar"
    const to = "concert2024@orangeinternational.edu.ar"
    const formattedDate = new Date(this.escenario.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const subject = `Tickets Orange 2024 -- ${this.user.apellido} ${this.user.nombre} (${this.user.dni}) / Concert: ${this.escenario.nombre}`
    let html = `
    <p>El estudiante:
    <span><strong>${this.user.nombre} ${this.user.apellido}</strong> - <strong>DNI ${this.user.dni}</strong></span></p>
    <p>Realizó la siguiente reserva para el concert ${this.escenario.nombre} ( ${formattedDate} - ${this.escenario.hora} ). Los detalles de las reservas:</p>
    `
    // Generar filas para cada reserva
    reservas.forEach((reserva:any) => {
      html += `<p>FILA: ${reserva.fila} -- BUTACA: ${reserva.butaca}</p>`
    });
    
    this.emailService.sendEmail(from,to,subject,html).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })
  } 
  
  confirmSeat() {
    if (this.selectedSeats.size === 0) {
        return;
    }

    const reserveDone = Array.from(this.selectedSeats).map(seatKey => {
        const [fila, butaca] = seatKey.split('-').map(Number);
        return {
            evento_id: this.escenario.id,
            fila,
            butaca,
            estado: 'reservado',
            dni: this.dni,
            fechaDni: new Date()
        };
    });

    this.reservationService.postReservations(this.dni, reserveDone).pipe(
        switchMap(() => 
            forkJoin([
                this.habilitationService.putCantidadHabilitacion(this.habilitation._id, this.habilitation.cantidad - reserveDone.length),
                this.historialService.createReserveHistorial({
                    dni: this.dni,
                    reservas: reserveDone
                })
            ])
        ),
        tap(() => {
            this.configEmail(reserveDone);
        })
    ).subscribe({
        next: () => {
            this.selectedSeats.clear();
            this.changePage.emit('reservated');
        },
        error: (error) => {
            if(error.error && error.status == 400){
              this.showOccupiedSeatsError()
            } 
            console.error('Error:', error);
            this.selectedSeats.clear();
        }
    });
  }

  showOccupiedSeatsError() {
    // Aquí puedes implementar la lógica para mostrar un mensaje al usuario
    alert('Algunos de los asientos seleccionados ya están ocupados. Por favor, selecciona otros asientos.');
    this.refreshScenario()
  }
  
  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
}

