import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../../core/services/data.service';
import { CookieService } from 'ngx-cookie-service';
import { Subscription } from 'rxjs';
import { ScenarioService } from '../../../core/services/scenario.service';


@Component({
  selector: 'app-scenario',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './scenario.component.html',
  styleUrl: './scenario.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class ScenarioComponent implements OnInit{
  
  private subscription!: Subscription;

  @Input() mostrarBoton = true
  @Input() escenario: any
  @Input() admin:boolean | undefined
  
  @Output() changePage = new EventEmitter<string>()
  
  private storageScenario = 'jsonData';
  private storageReserve = 'jsonReservation'
  private storageUsers = 'jsonUsers'
  
  // Carga de los 3 conciertos - salas
  seats: any | undefined
  // Los asientos que son seleccionados
  selectedSeats: Set<string> = new Set();
  seatOrder: any[] = []
  // La data de todas las reservas
  reservation: any | undefined
  // El dni del usuario
  dni: any
  // boton desactivo
  isDisabled: boolean | undefined
  // Todos los usuarios
  users: any | undefined

  constructor(
    private dataService: DataService,
    private cookieService: CookieService,
    private scenarioService: ScenarioService
  ){
  }
  
  ngOnInit(){
    this.subscription = this.scenarioService.updateScenario$.subscribe(data => {
      if (data) {
        this.seats = data
      }
    });
    this.seats = this.dataService.getData(this.storageScenario)
    this.reservation = this.dataService.getData(this.storageReserve)
    this.users = this.dataService.getData(this.storageUsers)
    if(this.admin){
      this.dni = this.cookieService.get('dniAdmin')
    }else{
      this.dni = this.cookieService.get('dni')
    }
  }

  getSeatKey(rowIndex: number, seatIndex: number): string {
    return `${rowIndex}-${seatIndex}`;
  }
  
  toggleSeatSelection(row:any,seat:any){
      // const seatKey = this.getSeatKey(row, seat);
      // if (this.selectedSeats.has(seatKey)) {
      //   this.selectedSeats.delete(seatKey);
      // } else {
      //   this.selectedSeats.add(seatKey);
      // }

      if((this.reservation.dni == undefined || this.reservation.dni != undefined && this.reservation.dni.length < 5)){
          const seatKey = this.getSeatKey(row, seat);
    
          if (this.selectedSeats.has(seatKey)) {
            // Si el asiento ya está seleccionado, lo eliminamos del conjunto y de la orden
            this.selectedSeats.delete(seatKey);
            this.seatOrder = this.seatOrder.filter(key => key !== seatKey);
          } else {
            // Si el asiento no está seleccionado, lo agregamos
            if (this.selectedSeats.size < 5) {
              this.selectedSeats.add(seatKey);
              this.seatOrder.push(seatKey);
            } else {
              // Si ya hay 5 asientos seleccionados, eliminamos el primero y luego agregamos el nuevo
              const firstSeatKey = this.seatOrder.shift();
              if (firstSeatKey) {
                this.selectedSeats.delete(firstSeatKey);
              }
              this.selectedSeats.add(seatKey);
              this.seatOrder.push(seatKey);
            }
          }
        }
  }
  
  getSeatClass(seat: any): string {
    if (!seat) {
      return 'empty-seat';
    }
    if (this.mySeat(seat)) {
      return 'seat-user';
    }
    if (this.isPaid(seat)) {
      return 'paid-seat';
    }
    if (this.isReservated(seat)) {
      return 'reservated-seat';
    }
    if (this.isSelected(seat.fila, seat.asiento)) {
      return 'selected-seat';
    }
    if (this.isAvailable(seat)) {
      return 'seat-available';
    }
    if (this.isDisabledSeat(seat)) {
      return 'disabled-seat';
    }
    return 'seat';
  }

  isAvailable(seat:any){
    return seat.estado == 'disponible' && !this.isDisabledSeat(seat)
  }

  isSelected(row: any, seat: any): boolean{
    return this.selectedSeats.has(this.getSeatKey(row, seat));
  }
  
  isReservated(seat:any):boolean{
    return seat.estado == 'reservado'
  }
  
  
  isPaid(seat: any):boolean{
    return seat.estado == 'pagado'
  }

  mySeat(seat:any){
    if(!this.reservation[this.dni]){
      return false
    }
    const isMySeat = this.reservation[this.dni].some((s:any) => ((s.fila === seat.fila) && (s.asiento === seat.asiento)));
    return isMySeat 
  }
  
  isDisabledSeat(seat: any){
    if(seat.fila == 8){
      if(seat.asiento == 51 || seat.asiento == 53 || seat.asiento == 55){
        return true
      }
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
      minutes: this.padNumber(now.getMinutes())}
  }


  confirmSeat(){

    if(this.selectedSeats.size == 0){
      return
    }

    const reserveDone: any[] = []
    const now = new Date();
    
    const currentDate = `${now.getFullYear()}-${this.padNumber(now.getMonth() + 1)}-${this.padNumber(now.getDate())}`;
    
    const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
    
    this.selectedSeats.forEach(seatKey => {
      const [fila, asiento] = seatKey.split('-').map(Number);
      reserveDone.push({
        fila,
        asiento,
        fecha:currentDate,
        hora: currentTime,
        concert: this.escenario.nombre,
        validado: null,
        estado: 'reservado'
      })

      // cambia de estado a reservado solo para en la funcionalidad del usuario
      for (let row of this.seats[this.escenario.sala]) {
        if (!row) continue;
        for (let seat of row) {
          if (seat && seat.fila === fila && seat.asiento === asiento) {
            seat.estado = 'reservado';
          }
        }
      }
      
    });
    if(this.reservation.hasOwnProperty(this.dni)){
      this.reservation[this.dni] = this.reservation[this.dni].concat(reserveDone)
    }else{
      this.reservation[this.dni] = reserveDone

    }
    this.dataService.saveData(this.storageReserve,this.reservation)
    
    this.dataService.saveData(this.storageScenario,this.seats)
    
    const pageReservation = 'reservated'
    this.changePage.emit(pageReservation)
    
    this.selectedSeats.clear();
  }
  
  ngOnDestroy(){
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}

