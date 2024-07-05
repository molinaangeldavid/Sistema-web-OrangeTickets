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
    const seatKey = this.getSeatKey(row, seat);
    if (this.selectedSeats.has(seatKey)) {
      this.selectedSeats.delete(seatKey);
    } else {
      this.selectedSeats.add(seatKey);
    }
    
  }
  
  isSelected(row: any, seat: any): boolean{
    return this.selectedSeats.has(this.getSeatKey(row, seat));
  }
  
  isAvailable(seat:any){
    return seat.estado == 'disponible' && !this.isDisabledSeat(seat)
  }
  
  isReservated(seat:any):boolean{
    return seat.estado == 'reservado'
  }
  
  mySeat(seat:any){
    if(!this.reservation[this.dni]){
      return false
    }
    return this.reservation[this.dni].some((s:any) => (s.fila === seat.fila) && (s.asiento === seat.asiento) && this.escenario.nombre == s.nombre);
  }

  isPaid(seat: any):boolean{
    return seat.estado == 'pagado'
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
  

  confirmSeat(){
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

