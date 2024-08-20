import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScenarioService } from '../../../core/services/scenario.service';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { lastValueFrom } from 'rxjs';
import { ReservationService } from '../../../core/services/reservation.service';

import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-manage-reserves',
  standalone: true,
  imports: [
    TableModule,
    DialogModule,
    ButtonModule,
    CommonModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ConfirmDialogModule,
    ProgressSpinnerModule
  ],
  templateUrl: './manage-reserves.component.html',
  styleUrl: './manage-reserves.component.css',
  providers:[ConfirmationService,MessageService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class ManageReservesComponent implements OnInit,OnChanges {
  
  @Input() escenario: any
  @Input() admin: any
  
  isLoading: boolean = true

  users: any | undefined
  
  reserves: any | undefined
  
  dialogVisible: boolean = false;
  
  dniSelected: any | undefined
  aloneDni: any
  
  allUsers: any
  allAdmins: any 
  selectedReserves: any
  
  adminMap: any

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private scenarioService:ScenarioService,
    private reservationService: ReservationService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef
    
  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
  }
  
  async ngOnInit(){
    try {
      const [reservation,users] = await Promise.all([
        lastValueFrom(this.reservationService.getAllReservations(this.escenario.id)),
        lastValueFrom(this.adminService.getAllUsers()),
      ])
      this.reserves = reservation
      this.allUsers = users.users
      this.allAdmins = users.adminUsers

      this.adminMap = new Map<string, string>();
      this.allAdmins.forEach((admin: any) => {
        this.adminMap.set(admin.dni, `${admin.nombre} ${admin.apellido}`);
      });
    } catch (error) {
      console.log(error)
    }
    finally{
      this.isLoading = false
    }
    const userReservations = this.reserves.filter((reserva:any) => {
      return reserva.evento_id === this.escenario.id && 
      (reserva.estado === 'reservado' || reserva.estado === 'pagado')
    });
    const validUser = new Set(userReservations.map((reserva:any)=> reserva.dni))
    this.users = this.allUsers.filter((user: any) => {
      return validUser.has(user.dni)
    });
  }
  
  async ngOnChanges(changes:SimpleChanges){
    try {
      if (changes['escenario'] && changes['escenario'].currentValue) {
        const [reservation,users] = await Promise.all([
          lastValueFrom(this.reservationService.getAllReservations(this.escenario.id)),
          lastValueFrom(this.adminService.getAllUsers()),
        ])
        this.reserves = reservation
        this.allUsers = users.users
        this.allAdmins = users.adminUsers
        setTimeout(() => {
          const userReservations = this.reserves.filter((reserva:any) => {
            return reserva.evento_id === this.escenario.id && 
            (reserva.estado === 'reservado' || reserva.estado === 'pagado')
          });
          const validUser = new Set(userReservations.map((reserva:any)=> reserva.dni))
          this.users = this.allUsers.filter((user:any) => {
            return validUser.has(user.dni)
          })
          // Reemplazar el array completo para que Angular detecte el cambio
          // Forzar la detección de cambios
          this.cdr.detectChanges();
        },0);
      
      } 
    }catch (error) {
      console.log(error)
    }
    finally{
      this.isLoading = false
    }
  }
  
  //////////////////////////////////////
  // Bloque de funciones de seleccion
  confirmSelectedReserves(dni:any,event:Event){
    const now = new Date();
    
    // const currentDate = `${this.padNumber(now.getDate())}-${this.padNumber(now.getMonth() + 1)}-${now.getFullYear()}`;
    // const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
    
    this.confirmationService.confirm({
      message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const userConfirm = this.dniSelected.filter((val:any) => this.selectedReserves?.includes(val));
        userConfirm.forEach((value:any) => {
          value.admin = this.admin.dni 
          value.fechaAdmin = now
          value.estado = 'pagado'
        })
        try {
          this.reservationService.confirmReserves({dniAdmin:this.admin.dni,selectedReserves:userConfirm}).subscribe({
            next: () => {
              this.reserves = {...this.reserves}
              this.selectedReserves = null;
              this.scenarioService.notifyScenarioUpdate()
              this.messageService.add({ severity: 'success', summary: 'Confirmacion Exitosa', detail: 'Reservas eliminadas', life: 3000 });
            },
            error: () => {
              this.scenarioService.notifyScenarioUpdate()
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al confirmar las reservas', life: 3000 });
            }
          });
        } catch (error) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado', life: 3000 });
        }   
        
      }
    });
  }
  
  deleteSelectedReserves(dni:any,event:Event) {
    
    this.confirmationService.confirm({
      message: 'Estas seguro/a de eliminar las reservas seleccionadas',
      target: event.target as EventTarget,
      header: 'Eliminacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const eliminadas = this.dniSelected.filter((val:any) => this.selectedReserves?.includes(val));
        this.dniSelected = this.dniSelected.filter((val:any) => !this.selectedReserves?.includes(val));
        this.reservationService.deleteReserves({dniAdmin:this.admin.dni,selectedReserves:eliminadas}).subscribe({
          next: () => {
            this.reserves = {...this.reserves}
            this.selectedReserves = null
            this.scenarioService.notifyScenarioUpdate()
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Reservas eliminadas satisfactoriamente', life: 3000 });
          },
          error: () => {
            this.scenarioService.notifyScenarioUpdate()
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar las reservas', life: 3000 });
          },
        })
        
      }
    });
  }
  // Fin
  //////////////////////////////
  // Aca data es la distribucion del escenario
  // updateScenario(data: any) {
  //   this.scenarioService.notifyScenarioUpdate(data);
  // }
  ///////////////////////////////
  ///////////////////////////////////
  // Aqui se quitan todas las reservas por usuario y los asientos vuelven a estar disponible
  // removeAllReserves(user: any, event: Event) {
  //   this.confirmationService.confirm({
  //     target: event.target as EventTarget,
  //     message: 'Estas seguro/a que deseas eliminar todas las reservas de este usuario?',
  //     header: 'Confirmacion de eliminacion',
  //     icon: 'pi pi-info-circle',
  //     acceptButtonStyleClass:"p-button-danger p-button-text",
  //     rejectButtonStyleClass:"p-button-text p-button-text",
  //     acceptIcon:"none",
  //     rejectIcon:"none",
  
  //     accept: () => {
  //       this.reserves[user.dni].forEach((reserve:any) => {
  //         const [fila, asiento] = [reserve.fila,reserve.asiento]
  //         // cambia de estado a reservado solo para en la funcionalidad del usuario
  //         for (let row of this.allSeats[this.escenario.sala]) {
  //           if (!row) continue;
  //           for (let seat of row) {
  //             if (seat && seat.fila === fila && seat.asiento === asiento) {
  //               seat.estado = 'disponible';
  //             }
  //           }
  //         }
  //       })
  //       this.updateScenario(this.allSeats)
  //       delete this.reserves[user.dni]
  //       this.dataService.saveData('jsonReservation',this.reserves)
  //       this.dataService.saveData('jsonData',this.allSeats)
  //       this.users = this.users.filter((val:any) => val.dni !== user.dni);
  //       user = {}
  //       this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Reservas eliminadas' });
  //     },
  //     reject: () => {
  //       this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Accion rechazada' });
  //     }
  //   });
  // }
  
  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  // Aqui se confirman las reservas y pasan a ser pagadas
  acceptAllReserves(user:any,event:Event){
    const now = new Date();
    
    // const currentDate = `${now.getFullYear()}-${this.padNumber(now.getMonth() + 1)}-${this.padNumber(now.getDate())}`;
    // const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
    
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Estas seguro/a que deseas validar todas las reservas',
      header: 'Confirmacion de eliminacion',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        this.reservationService.getReservationAdmin(user.dni).subscribe(reservesDni=>{
          // this.dniSelected = value
          if(reservesDni.some((r:any) => r.estado == 'reservado')){
            alert("Todas las butacas de este usuario ya estan confirmadas")
            return;
          }else{
            reservesDni.forEach((value:any) => {
              if(value.estado !== 'pagado'){
                value.admin = this.admin.dni 
                value.fechaAdmin = now
                value.estado = 'pagado'
              }
            })
          }
          try {
            this.reservationService.confirmReserves({dniAdmin:this.admin.dni,selectedReserves:reservesDni}).subscribe({
              next: () => {
                this.reserves = {...this.reserves}
                user = {...user}
                this.scenarioService.notifyScenarioUpdate()
                this.messageService.add({ severity: 'success', summary: 'Confirmacion Exitosa', detail: 'Reservas eliminadas', life: 3000 });
              },
              error: () => {
                this.scenarioService.notifyScenarioUpdate()
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al confirmar las reservas', life: 3000 });
              }
            });
          } catch (error) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error inesperado', life: 3000 });
          }   
        })
        this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Todas las reservas pasaron a ser confirmadas' });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Accion rechazada', life: 3000 });
      }
    });
    
  }
  // Aqui se quita una reserva indicada por el asiento y fila. Ese asiento vuelve a estar disponible
  // freeOneReserve(reserve:any){
  
  // }
  // // Aqui se confirma una reserva y pasa a ser pagada
  // acceptOneReserve(reserve:any){
  
  // }
  
  descarga(){
    const now = new Date();
    
    const currentDate = `${this.padNumber(now.getDate())}-${this.padNumber(now.getMonth() + 1)}-${now.getFullYear()}`;
    
    const combinedList: any[] = [];
    
    // Recorre todos los usuarios
    this.users.forEach((user:any) => {
      const dni = user.dni;
      
      // Verifica si hay reservas para el DNI del usuario
      if (this.reserves[dni]) {
        // Recorre todas las reservas del usuario
        this.reserves[dni].forEach((reservation:any) => {
          combinedList.push({ ...user, ...reservation });
        });
      }
    });
    console.log(combinedList)
    // Crea una hoja de trabajo (worksheet)
    const worksheet = XLSX.utils.json_to_sheet(combinedList);
    
    // Crea un libro de trabajo (workbook) y agrega la hoja de trabajo
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Reporte ${currentDate} `);
    
    // Genera el archivo Excel y descarga
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, `${this.escenario.nombre}-${currentDate}.xlsx`);
  }
  
  hasReservedSeats(){
    
  }

  getInfoUser(dni:any){
    const reservesDni = this.reserves.filter((reserveUser:any) => reserveUser.dni == dni)
    return reservesDni
  }

  haveReservedSeats(dni: any): boolean {
    return this.reserves.some((s: any) => s.dni === dni && s.estado === "reservado");
  }

  areAllSeatsConfirmed(dni: any): boolean {
    return this.reserves
      .filter((s: any) => s.dni === dni)
      .every((s: any) => s.estado === "pagado");
  }

  showDialog(dni: any):void{
    // DNISELECTED es el array de reservas de ese dni
    this.aloneDni = dni
    this.dniSelected = this.getInfoUser(dni)
    this.dialogVisible = true;
  }
}


