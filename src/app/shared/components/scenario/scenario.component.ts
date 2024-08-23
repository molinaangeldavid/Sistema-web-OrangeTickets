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
    private cookieService: CookieService,
    private scenarioService: ScenarioService,
    private reservationService: ReservationService,
    private dataService: DataService,
    private router: Router
  ){
  }
  
  async ngOnInit(){
    this.habilitation = this.habilitation.find((h:any) => h.evento_id == this.escenario.id)
    this.loading = true
    if(this.admin){
      this.dni = this.cookieService.get('dniAdmin')
    }else{
      this.dni = this.cookieService.get('dni')
    }
    
    this.user = this.dataService.getData('data')
    
    const currentDate = new Date()
    this.isReservationAllowed = this.checkReservationPermission(this.user.anio,currentDate)
    
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
  
  checkReservationPermission(userGrade:number,currentDate: Date): boolean {
    if(this.habilitation){
      const habilitationStart = new Date(this.habilitation.desde);
      const habilitationThirdDay = new Date(habilitationStart.getTime() + 3 * 24 * 60 * 60 * 1000);
      const habilitationFinish = new Date(this.habilitation.hasta)
      
      if(currentDate > habilitationThirdDay && currentDate < habilitationFinish){
        return true; 
      }
      
      if(currentDate < habilitationStart){
        return false
      }
      
      const currentHour = currentDate.getHours();
      const isMorningWindow = currentHour >= 7 && currentHour < 13;
      const isAfternoonWindow = currentHour >= 14 && currentHour < 20;
      
      if (userGrade === 6) {
        if (isMorningWindow || isAfternoonWindow) {
          return true; // Puede reservar en el periodo correcto
        }
      } else if (userGrade >= 1 && userGrade <= 5) {
        if (isAfternoonWindow) {
          return true; // Puede reservar en la ventana de tarde
        }
      }
      return false;
    }
    return false
  }
  
  getMaxSeatsAllowed(userGrade: number, currentDateTime: Date, existingReservations:any): number {
    const habilitationStart = new Date(this.habilitation.desde);
    const habilitationThirdDay = new Date(habilitationStart.getTime() + 3 * 24 * 60 * 60 * 1000);
    const habilitationFinish = new Date(this.habilitation.hasta) 
    
    const currentHour = currentDateTime.getHours();
    const isMorningWindow = currentHour >= 7 && currentHour < 13;
    const isAfternoonWindow = currentHour >= 14 && currentHour < 20;
    
    let maxSeats: any = 0
    if (currentDateTime > habilitationThirdDay && currentDateTime < habilitationFinish) {
      return Infinity; // Puede reservar cualquier cantidad de asientos
    }
    
    if (userGrade === 6) {
      if (isMorningWindow) {
        console.log("egresado maniana")
        maxSeats = Math.max(2 - existingReservations, 0);
      } else if (isAfternoonWindow) {
        console.log("egresado tarde")
        maxSeats = Math.max(5 - existingReservations, 0); // Máximo 5 asientos en la tarde
      }
    } else if (userGrade >= 1 && userGrade <= 5) {
      if (isAfternoonWindow) {
        console.log("no egresado")
        maxSeats = Math.max(5 - existingReservations, 0); // Máximo 5 asientos en la tarde
      }
    }
    
    return maxSeats; // No puede reservar fuera del horario permitido
  }
  
  async toggleSeatSelection(row:any,seat:any,tipo:any){
    const seatKey = this.getSeatKey(row, seat);
    if (this.selectedSeats.has(seatKey)) {
      this.selectedSeats.delete(seatKey);
      this.total -= this.escenario.valor
    } else {
      const totalReservation = await lastValueFrom(this.reservationService.getReservation(this.user.dni))
      
      const maxSeatsAllowed = this.getMaxSeatsAllowed(this.user.anio, new Date(),totalReservation.length);
      console.log(maxSeatsAllowed)
      if (this.selectedSeats.size >= maxSeatsAllowed) {
        alert("No puede seleccionar mas asientos. Pruebe mas tarde")
        this.isReservationAllowed = false
        return;
      }
      if(tipo == 'd'){
        alert('Estas seleccionando una butaca para discapacitados')
      }
      this.selectedSeats.add(seatKey);
      this.total += this.escenario.valor
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

