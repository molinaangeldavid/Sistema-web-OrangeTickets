import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA,Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DataService } from '../../../core/services/data.service';
import { CookieService } from 'ngx-cookie-service';


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
export class ScenarioComponent {
  
  
  @Input() user: any
  @Input() mostrarBoton = true
  
  @Output() changePage = new EventEmitter<string>()
  
  private storageScenario = 'jsonData';
  private storageScenario2 = 'jsonData2';
  private storageReserve = 'jsonReservation'
  private storageUsers = 'jsonUsers'
  
  costo:number = 7500
  
  seats: any | undefined
  
  selectedSeats: Set<string> = new Set();
  
  reservation: any | undefined
  
  dni: any
  
  isDisabled: boolean | undefined
  
  users: any | undefined

  constructor(
    private dataService: DataService,
    private cookieService: CookieService
  ){
  }
  
  ngOnInit(){
    this.seats = this.dataService.getData(this.storageScenario)
    this.reservation = this.dataService.getData(this.storageReserve)
    this.users = this.dataService.getData(this.storageUsers)
    this.dni = this.cookieService.get('dni')
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
    return seat.estado == 'disponible'
  }
  
  isReservated(seat:any):boolean{
    return seat.estado == 'reservado'
  }
  
  isPaid(seat: any):boolean{
    return seat.estado == 'pagado'
  }
  
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  confirmSeat(){
    const reserveDone: any[] = []
    const now = new Date();
    
    const currentDate = `${now.getFullYear()}-${this.padNumber(now.getMonth() + 1)}-${this.padNumber(now.getDate())}`;
    
    const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}:${this.padNumber(now.getSeconds())}`;
    
    this.selectedSeats.forEach(seatKey => {
      const [fila, asiento] = seatKey.split('-').map(Number);
      reserveDone.push({
        fila,
        asiento,
        fecha:currentDate,
        hora: currentTime,
        estado: 'Reservado'
      })
      for (let row of this.seats.scenario) {
        if (!row) continue;
        for (let seat of row) {
          if (seat && seat.fila === fila && seat.asiento === asiento) {
            seat.estado = 'reservado';
          }
        }
      }
      
    });
    this.reservation[this.dni] = reserveDone
    this.dataService.saveData(this.storageReserve,this.reservation)
    
    this.dataService.saveData(this.storageScenario,this.seats)
    
    const pageReservation = 'reservated'
    this.changePage.emit(pageReservation)
    
    this.selectedSeats.clear();
  }
  
}

