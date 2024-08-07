import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,Component, EventEmitter, Input, Output, OnInit} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom, Subscription } from 'rxjs';
import { ScenarioService } from '../../../core/services/scenario.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-scenario',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    ProgressSpinnerModule
  ],
  templateUrl: './scenario.component.html',
  styleUrl: './scenario.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA]
})
export class ScenarioComponent implements OnInit{
  
  private subscription!: Subscription;
  
  loading: any = true
  
  @Input() mostrarBoton = true
  @Input() escenario: any
  @Input() admin:boolean | undefined
  
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
  
  constructor(
    private cookieService: CookieService,
    private scenarioService: ScenarioService,
    private reservationService: ReservationService,
    private dataService: DataService
  ){
  }
  
  async ngOnInit(){
    if(this.admin){
      this.dni = this.cookieService.get('dniAdmin')
    }else{
      this.dni = this.cookieService.get('dni')
    }
    this.user = this.dataService.getData('data')
    this.subscription = this.scenarioService.updateScenario$.subscribe(data => {
      if (data) {
        this.seats = data
      }
    });
    try {
      const [scenarioData,allReservation ,reservationData] = await Promise.all([
        lastValueFrom(this.scenarioService.getScenario(this.escenario.sala)),
        lastValueFrom(this.reservationService.getAllReservations(this.escenario.sala)),
        lastValueFrom(this.reservationService.getReservation(this.dni))
      ]) 
      this.seats = scenarioData
      this.reservation = allReservation
      this.reservationDni = reservationData
    } catch (error) {
      console.error('Error al cargar datos', error)
    }
    finally{
      this.loading = false
    }
  }
  
  getSeatKey(rowIndex: number, seatIndex: number): string {
    return `${rowIndex}-${seatIndex}`;
  }

  // Funcion para ver si es dentro del 8 de noviembre y  9 de noviembre 
  isWithinReservationLimit(): boolean {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 7, 5, 7, 0, 0);
    const endDate = new Date(currentDate.getFullYear(), 7, 6, 7, 0, 0);
    return currentDate >= startDate && currentDate <= endDate;
  }
  // Analiza si esta entre el inicio de tiempo de reserva y dos dias despues
  hasReachedReservationLimit(): boolean {
    if (this.isWithinReservationLimit()) {
      return !this.canReserveMoreSeats(this.user.anio);
    }
    return false;
  }
  // Retorna un string indicando que parte del dia es
  getCurrentReservationPhase(): string {
    const currentDate = new Date();
    const hours = currentDate.getHours();
    
    if (this.isWithinReservationLimit()) {
      if (hours >= 7 && hours < 13) {
        return 'morning'; // 7 am - 1 pm
      } else if (hours >= 14 && hours < 20) {
        return 'afternoon'; // 2 pm - 8 pm
      }
    }
    return 'none'; // Fuera del rango de restricción de 6-9 de noviembre o fuera de horas específicas
  }
  
  canReserveMoreSeats(nivel:any): boolean {
    const reservationPhase = this.getCurrentReservationPhase();
    
    if (reservationPhase === 'morning' && nivel === 6) {
      return this.reservationDni && this.reservationDni.length < 2;
    } else if (reservationPhase === 'afternoon') {
      return this.reservationDni && this.reservationDni.length < 5;
    }
    return true; // Sin restricciones fuera de las fechas y horas especificadas
  }
  
  toggleSeatSelection(row:any,seat:any){
    if(this.isWithinReservationLimit() && this.selectedSeats.size >= 5){
      return;
    }
    
    const seatKey = this.getSeatKey(row, seat);
    if (this.selectedSeats.has(seatKey)) {
      this.selectedSeats.delete(seatKey);
    } else {
      this.selectedSeats.add(seatKey);
    }
    
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
    return this.reservation.some((reservedSeat:any) => reservedSeat.fila === seat.fila && reservedSeat.butaca === seat.butaca && reservedSeat.estado === "reservado");
  }
  
  isPaid(seat: any):boolean{
    return this.reservation.some((reservedSeat:any) => reservedSeat.fila === seat.fila && reservedSeat.butaca === seat.butaca && reservedSeat.estado === "pagado");
  }
  
  mySeat(seat:any){
    return this.reservationDni.some((s:any) => ((s.fila === seat.fila) && (s.butaca === seat.butaca)));
  }
  
  isDisabledSeat(seat: any){
    if(seat.fila == 8){
      if(seat.tipo == 'd'){
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
      
      this.selectedSeats.forEach(seatKey => {
        const [fila, butaca] = seatKey.split('-').map(Number);
        reserveDone.push({
          evento_id:this.escenario.sala,
          fila,
          butaca,
          estado: 'reservado',
          dni: this.dni,
          fechaDni:now
        })
      });
      this.reservationService.postReservations(reserveDone,this.dni).subscribe(
        (response) => {
          console.log('Reservas Guardadas', response)
        },
        (error) => {
          console.log('Error al guardar reservas', error)
        }
      )
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
  
  