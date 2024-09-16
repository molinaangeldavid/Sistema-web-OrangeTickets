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

import * as ExcelJS from 'exceljs'
import * as FileSaver from 'file-saver';
import { forkJoin, lastValueFrom, of, switchMap } from 'rxjs';
import { ReservationService } from '../../../core/services/reservation.service';

import { AdminService } from '../../../core/services/admin.service';
import { HabilitacionesService } from '../../../core/services/habilitaciones.service';
import { HistorialService } from '../../../core/services/historial.service';
import { MessagesModule } from 'primeng/messages';
import { DataService } from '../../../core/services/data.service';

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
    ProgressSpinnerModule,
    MessagesModule
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

  dataAdmin: any
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private scenarioService:ScenarioService,
    private reservationService: ReservationService,
    private adminService: AdminService,
    private cdr: ChangeDetectorRef,
    private habilitacionService: HabilitacionesService,
    private historialService: HistorialService,
    private dataService: DataService
    
  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
  }
  
  async ngOnInit(){
    try {
      const [reservation,users] = await Promise.all([
        lastValueFrom(this.reservationService.getAllReservationsAdmin(this.escenario.id)),
        lastValueFrom(this.adminService.getAllUsers()),
      ])
      this.reserves = reservation
      this.allUsers = users.users
      this.allAdmins = users.adminUsers
      const dni = this.dataService.getData('dniAdmin')
      if(dni){
        this.dataAdmin = this.allAdmins.find((a:any) => a.dni == dni)
      }
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
    const userReservations = this.reserves!.filter((reserva:any) => {
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
          lastValueFrom(this.reservationService.getAllReservationsAdmin(this.escenario.id)),
          lastValueFrom(this.adminService.getAllUsers()),
        ])
        this.reserves = reservation
        this.allUsers = users.users
        this.allAdmins = users.adminUsers
        setTimeout(() => {
          const userReservations = this.reserves!.filter((reserva:any) => {
            return reserva.evento_id === this.escenario.id && 
            (reserva.estado === 'reservado' || reserva.estado === 'pagado')
          });
          const validUser = new Set(userReservations.map((reserva:any)=> reserva.dni))
          this.users = this.allUsers.filter((user:any) => {
            return validUser.has(user.dni)
          })
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
  async updateUserTable() {
    this.reserves = await lastValueFrom(this.reservationService.getAllReservationsAdmin(this.escenario.id))
    const userReservations = this.reserves!.filter((reserva:any) => {
      return reserva.evento_id === this.escenario.id && 
      (reserva.estado === 'reservado' || reserva.estado === 'pagado')
    });
    const validUser = new Set(userReservations.map((reserva:any)=> reserva.dni))
    this.users = this.allUsers.filter((user: any) => {
      return validUser.has(user.dni)
    });
  }
  //////////////////////////////////////
  // Bloque de funciones de seleccion
  confirmSelectedReserves(event:Event){
    if (!this.selectedReserves || !this.selectedReserves.length) {
      return;
    }
    const now = new Date();
    
    this.confirmationService.confirm({
      message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const userConfirm = this.dniSelected.filter((val:any) => this.selectedReserves?.includes(val));
        this.dniSelected = this.dniSelected.filter((val:any) => !this.selectedReserves?.includes(val));
        userConfirm.forEach((value:any) => {
          value.admin = this.admin.dni 
          value.fechaAdmin = now
          value.estado = 'pagado'
        })
        this.reservationService.confirmReserves({dniAdmin:this.admin.dni,selectedReserves:userConfirm}).pipe(
          switchMap(()=> 
            this.historialService.confirmOrRemove({
                    tipo: "confirmaciones",
                    dni: this.admin.dni,
                    admin: true,
                    reservas: userConfirm
              })
          )
        )
        .subscribe({
            next: () => {
              this.dialogVisible = false
              this.updateUserTable()
              this.selectedReserves = null;
              this.scenarioService.notifyScenarioUpdate()
              this.cdr.detectChanges();

            },
            error: () => {
              this.dialogVisible = false
              this.updateUserTable()
              this.scenarioService.notifyScenarioUpdate()
              this.cdr.detectChanges();
            }
          });
      }
    });
  }
  
  deleteSelectedReserves(dni:any,event:Event) {
    if (!this.selectedReserves || !this.selectedReserves.length) {
      return;
    }
    this.confirmationService.confirm({
      message: 'Estas seguro/a de eliminar las reservas seleccionadas',
      target: event.target as EventTarget,
      header: 'Eliminacion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
      const reservasPagadas = this.dniSelected.filter((val: any) => this.selectedReserves?.includes(val) && val.estado === 'pagado');
      const reservasReservadas = this.dniSelected.filter((val: any) => this.selectedReserves?.includes(val) && val.estado === 'reservado');

        let eliminarPagadas$ = reservasPagadas.length ? 
        this.reservationService.deleteReservesPagadas({ dniAdmin: this.admin.dni, selectedReserves: reservasPagadas }) : 
        of(null);

      // Eliminar las reservas reservadas
      let eliminarReservadas$ = reservasReservadas.length ? 
        this.reservationService.deleteReserves({ dniAdmin: this.admin.dni, selectedReserves: reservasReservadas }) : 
        of(null);
        forkJoin([eliminarPagadas$,eliminarReservadas$]).pipe(
          switchMap(()=>
            this.historialService.confirmOrRemove({
                tipo: "eliminaciones",
                dni: this.admin.dni,
                admin: true,
                reservas: [...reservasPagadas, ...reservasReservadas]
              })
          ),
          switchMap(() => 
            this.habilitacionService.putCantidadHabilitacionAdmin(dni,[...reservasPagadas, ...reservasReservadas])
          )
        ).subscribe({
            next: () => {
              this.dialogVisible = false
              this.updateUserTable()
              this.selectedReserves = null
              this.scenarioService.notifyScenarioUpdate()
              this.cdr.detectChanges();
            },
            error: () => {
              this.dialogVisible = false
              this.updateUserTable()
              this.scenarioService.notifyScenarioUpdate()
              this.cdr.detectChanges();
            },
          })
      }
    });
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }
  
  // Aqui se confirman las reservas y pasan a ser pagadas
  acceptAllReserves(user: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: '¿Estás seguro/a que deseas validar todas las reservas?',
      header: 'Confirmación de validación',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        // Mover la lógica de validación y actualización aquí
        this.reservationService.getReservationAdmin(user.dni).subscribe(reservesDni => {
          const now = new Date();
          const reservasAConfirmar = reservesDni.filter((r: any) => r.estado === 'reservado');
          if (reservasAConfirmar.length > 0) {
            reservasAConfirmar.forEach((value: any) => {
              if (value.estado !== 'pagado') {
                value.admin = this.admin.dni;
                value.fechaAdmin = now;
                value.estado = 'pagado';
              }
            });
            this.reservationService.confirmReserves({ dniAdmin: this.admin.dni, selectedReserves: reservasAConfirmar }).pipe(
              switchMap(() =>
                this.historialService.confirmOrRemove({
                    tipo: "confirmaciones",
                    dni: this.admin.dni,
                    admin: true,
                    reservas: reservesDni
                  })
              )
            )
            .subscribe({
                next: () => {
                  this.updateUserTable()
                  this.scenarioService.notifyScenarioUpdate();
                },
                error: () => {
                  this.scenarioService.notifyScenarioUpdate();
                }
              });
          }
        });
      },
    });
  }
  
  getInfoUser(dni:any){
    const reservesDni = this.reserves.filter((reserveUser:any) => reserveUser.dni == dni)
    return reservesDni
  }
  
  haveReservedSeats(dni: any): boolean {
    if (this.reserves && Array.isArray(this.reserves)) {
      // Aplana la matriz
      const flattenedReserves = this.reserves.flat();
  
      // Ahora puedes aplicar `some` al array aplanado
      return flattenedReserves.some((s: any) => s.dni === dni && s.estado === "reservado");
    } else {
      console.error("this.reserves no es un array o está indefinido");
    }
  
    return false;
  }
  
  areAllSeatsConfirmed(dni: any): boolean {
    
    if (Array.isArray(this.reserves)) {
      // Aplana la matriz
      const flattenedReserves = this.reserves.flat();
  
      // Filtra y aplica `every` al array aplanado
      return flattenedReserves
        .filter((s: any) => s.dni === dni)
        .every((s: any) => s.estado === "pagado");
    } else {
      console.error("this.reserves no es un array o está indefinido");
    }
  
    return false;
  }
  
  formatFechaUTC(fechaUTC: any): string {
    if (!fechaUTC || typeof fechaUTC !== 'string') {
      throw new Error('Fecha UTC inválida');
    }
    const fecha = new Date(fechaUTC);
    // Verifica si la fecha es válida
    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha UTC no válida');
    }
    const year = fecha.getUTCFullYear();
    const month = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const day = String(fecha.getUTCDate()).padStart(2, '0');
    const hours = String(fecha.getUTCHours()).padStart(2, '0');
    const minutes = String(fecha.getUTCMinutes()).padStart(2, '0');
    
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }
  
  getAdmin(dni:any){
    const admin = this.allAdmins.find((e:any) => e.dni == dni)
    if(!admin){
      return
    }
    return `${admin.nombre} ${admin.apellido}`
  }
  
  isDisabledSeat(reserva: any): boolean {
    return reserva.tipo == 'd'; 
  }
  
  descarga(){
    const now = new Date();
    
    const currentDate = `${this.padNumber(now.getDate())}-${this.padNumber(now.getMonth() + 1)}-${now.getFullYear()}`;
    
    const combinedList: any[] = [];
    
    // Recorre todos los usuarios
    this.allUsers.forEach((user:any) => {
      const res = this.getInfoUser(user.dni)
      // Verifica si hay reservas para el DNI del usuario
      if (res) {
        // Recorre todas las reservas del usuario
        res.forEach((reservation:any) => {
          combinedList.push({ 
            DNI: user.dni,
            NOMBRE: user.nombre,
            APELLIDO: user.apellido,
            CICLO: user.ciclo,
            GRADO_ANIO: user.anio,
            DIVISION: user.division,
            FILA: reservation.fila,
            BUTACA: reservation.butaca,
            CONFIRMADO_POR: reservation.admin ? this.getAdmin(reservation.admin) : 'No confirmado',
            FECHA_DE_CONFIRMACION: reservation.fechaAdmin ? this.formatFechaUTC(reservation.fechaAdmin) : 'No confirmado'
          });
        });
      }
    });
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Reporte ${currentDate}`);
    worksheet.columns = [
      { header: 'DNI', key: 'DNI', width: 15 },
      { header: 'NOMBRE', key: 'NOMBRE', width: 20 },
      { header: 'APELLIDO', key: 'APELLIDO', width: 20 },
      { header: 'CICLO', key: 'CICLO', width: 10 },
      { header: 'GRADO_AÑO', key: 'GRADO_ANIO', width: 15 },
      { header: 'DIVISION', key: 'DIVISION', width: 10 },
      { header: 'FILA', key: 'FILA', width: 10 },
      { header: 'BUTACA', key: 'BUTACA', width: 10 },
      { header: 'CONFIRMADO_POR', key: 'CONFIRMADO_POR', width: 25 },
      { header: 'FECHA_DE_CONFIRMACION', key: 'FECHA_DE_CONFIRMACION', width: 25 },
  ];

  // Agrega las filas
  combinedList.forEach(data => {
      worksheet.addRow(data);
  });

  // Aplica el formato de centrado a todas las celdas
  worksheet.eachRow((row, rowNumber) => {
      row.eachCell((cell, colNumber) => {
          cell.alignment = { horizontal: 'center', vertical: 'middle' };
      });
  });

  // Genera el archivo Excel y descarga
  workbook.xlsx.writeBuffer().then((buffer) => {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      FileSaver.saveAs(data, `${this.escenario.nombre}-${currentDate}.xlsx`);
  });
  }
  
  showDialog(dni: any):void{
    // DNISELECTED es el array de reservas de ese dni
    this.aloneDni = dni
    this.dniSelected = this.getInfoUser(dni)
    this.dialogVisible = true;
  }
}


