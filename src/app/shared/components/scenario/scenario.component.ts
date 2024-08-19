import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,Component, EventEmitter, Input, Output, OnInit, SimpleChanges} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CookieService } from 'ngx-cookie-service';
import { lastValueFrom, Subscription } from 'rxjs';
import { ScenarioService } from '../../../core/services/scenario.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DataService } from '../../../core/services/data.service';
import { Router } from '@angular/router';

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
  
  loading: any
  
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
  
  total: any = 0

  constructor(
    private cookieService: CookieService,
    private scenarioService: ScenarioService,
    private reservationService: ReservationService,
    private dataService: DataService,
    private router: Router
  ){
  }
  
  async ngOnInit(){
    this.loading = true
    if(this.admin){
      this.dni = this.cookieService.get('dniAdmin')
    }else{
      this.dni = this.cookieService.get('dni')
    }
    this.user = this.dataService.getData('data')
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
  
  // Funcion para ver si es dentro del 8 de noviembre y  9 de noviembre 
  // isWithinReservationLimit(): boolean {
  //   const currentDate = new Date();
  //   const startDate = new Date(currentDate.getFullYear(), 7, 8, 7, 0, 0); // 6/08
  //   const endDate = new Date(currentDate.getFullYear(), 7, 30, 7, 0, 0); // 6/08
  //   return currentDate >= startDate && currentDate <= endDate;
  // }
  // Analiza si esta entre el inicio de tiempo de reserva y dos dias despues
  // hasReachedReservationLimit(): boolean {
  //   if (this.isWithinReservationLimit()) {
  //     return !this.canReserveMoreSeats(this.user.anio);
  //   }
  //   return false;
  // }
  
  // Retorna un string indicando que parte del dia es
  // getCurrentReservationPhase(): string {
  //   const currentDate = new Date();
  //   const hours = currentDate.getHours();
    
  //   if (this.isWithinReservationLimit()) {
  //     if (hours >= 7 && hours < 13) {
  //       return 'morning'; // 7 am - 1 pm
  //     } else if (hours >= 14 && hours < 19) {
  //       return 'afternoon'; // 2 pm - 8 pm
  //     }
  //   }
  //   return 'none'; // Fuera del rango de restricción de 6-9 de noviembre o fuera de horas específicas
  // }
  
  // canReserveMoreSeats(nivel:any): boolean {
  //   const reservationPhase = this.getCurrentReservationPhase();
    
  //   if (reservationPhase === 'morning' && nivel === 6) {
  //     return this.reservationDni && this.reservationDni.length < 2;
  //   } else if (reservationPhase === 'afternoon') {
  //     return this.reservationDni && this.reservationDni.length < 5;
  //   }
  //   return true; // Sin restricciones fuera de las fechas y horas especificadas
  // }
  
  toggleSeatSelection(row:any,seat:any){
    const seatKey = this.getSeatKey(row, seat);
    
    if (this.selectedSeats.has(seatKey)) {
      this.selectedSeats.delete(seatKey);
      this.total -= this.escenario.valor
    } else {
      const maxSelectableSeats = 5 - (this.reservationDni ? this.reservationDni.length : 0);
      if(this.selectedSeats.size < maxSelectableSeats){
        this.selectedSeats.add(seatKey);
        this.total += this.escenario.valor
      }else{
        alert("No se puede seleccionar mas asientos")
      }
    }
    
    // if (this.selectedSeats.has(seatKey)) {
    //   // Si el asiento ya está seleccionado, lo eliminamos del conjunto y de la orden
    //   this.selectedSeats.delete(seatKey);
    //   this.seatOrder = this.seatOrder.filter(key => key !== seatKey);
    // } else {
    //   // Si el asiento no está seleccionado, lo agregamos
    //   if (this.selectedSeats.size < 5) {
    //     this.selectedSeats.add(seatKey);
    //     this.seatOrder.push(seatKey);
    //   } else {
    //     // Si ya hay 5 asientos seleccionados, eliminamos el primero y luego agregamos el nuevo
    //     const firstSeatKey = this.seatOrder.shift();
    //     if (firstSeatKey) {
    //       this.selectedSeats.delete(firstSeatKey);
    //     }
    //     this.selectedSeats.add(seatKey);
    //     this.seatOrder.push(seatKey);
    //   }
    // }
    
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
      minutes: this.padNumber(now.getMinutes())
    }
  }
  
  confirmSeat(){
    if(this.selectedSeats.size == 0){
      return;
    }
    
    const reserveDone: any[] = []
    
    const seatsToCheck: { fila: number, butaca: number }[] = [];
    
    this.selectedSeats.forEach(seatKey => {
      const [fila, butaca] = seatKey.split('-').map(Number);
      seatsToCheck.push({
        fila,
        butaca
      });
    });
    this.reservationService.checkSeatAvailable(this.escenario.sala, seatsToCheck).subscribe({
      next: (availableSeats) => {
        if(availableSeats.length == seatsToCheck.length){
          this.selectedSeats.forEach(seatKey => {
            const [fila, butaca] = seatKey.split('-').map(Number);
            reserveDone.push({
              evento_id:this.escenario.id,
              fila,
              butaca,
              estado: 'reservado',
              dni: this.dni,
              fechaDni:new Date()
            })
          });
          this.reservationService.postReservations(this.dni,reserveDone).subscribe({
            next: () => {
              this.selectedSeats.clear();
              const pageReservation = 'reservated'
              this.changePage.emit(pageReservation)
            },
            error: (error:any) => {
              this.showOccupiedSeatsError();
              this.selectedSeats.clear();
            }
          })
        }else{
          this.showOccupiedSeatsError();
        }
      },
      error: (error)=> {
        console.log('Error al verificar la disponibilidad de asientos', error);
      }
      
    }
  );
  
}
showOccupiedSeatsError() {
  // Aquí puedes implementar la lógica para mostrar un mensaje al usuario
  alert('Algunos de los asientos seleccionados ya están ocupados. Por favor, selecciona otros asientos.');
  setTimeout(() => {
    // Redirigir a la misma página o componente actual
    this.router.navigateByUrl(this.router.url)
  }, 3000); // Espera de 3 segundos antes de redirigir
}


ngOnDestroy(){
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
}

}

