import { CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { DataService } from '../../../core/services/data.service';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ScenarioService } from '../../../core/services/scenario.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


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
    ConfirmDialogModule
  ],
  templateUrl: './manage-reserves.component.html',
  styleUrl: './manage-reserves.component.css',
  providers:[ConfirmationService,MessageService],
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class ManageReservesComponent implements OnInit,OnChanges {
  
  @Input() escenario: any
  @Input() admin: any
  
  users: any | undefined
  
  reserves: any | undefined
  
  dialogVisible: boolean = false;
  
  dniSelected: any | undefined
  aloneDni: any
  
  allUsers: any  = []
  
  allSeats: any
  
  selectedProducts: any
  
  constructor(
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private scenarioService:ScenarioService,
    private cdr: ChangeDetectorRef
  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
  }
  
  ngOnInit(){
    console.log("puta",this.escenario)
    this.allSeats = this.dataService.getData('jsonData')
    this.reserves = this.dataService.getData('jsonReservation');
    this.allUsers = this.dataService.getData('jsonUsers')
    this.users = this.allUsers.usuarios.filter((user: any) => {
      const userReservations = this.reserves[user.dni] || [];
      return userReservations.some((reserva: any) => {
        reserva.concert === this.escenario && 
        (reserva.estado === 'reservado' || reserva.estado === 'pagado')
      });
    });
}
ngOnChanges(changes:SimpleChanges){
  if (changes['escenario'] && changes['escenario'].currentValue) {
    this.reserves = this.dataService.getData('jsonReservation')
    setTimeout(() => {
      this.allUsers = this.dataService.getData('jsonUsers');
      const updatedUsers = this.allUsers.usuarios.filter((user: any) => {
        const userReservations = this.reserves[user.dni] || [];
        const escenarioNombre = changes['escenario'].currentValue.nombre;
        return userReservations.some((reserva: any) => 
          reserva.concert === escenarioNombre && 
        (reserva.estado === 'reservado' || reserva.estado === 'pagado')
      );
    });
    
    // Reemplazar el array completo para que Angular detecte el cambio
    this.users = [...updatedUsers];
    
    // Forzar la detección de cambios
    this.cdr.detectChanges();
  }, 0);
} 
}

//////////////////////////////////////
// Bloque de funciones de seleccion
confirmSelectedReserves(dni:any,event:Event){
  const now = new Date();
  
  const currentDate = `${this.padNumber(now.getDate())}-${this.padNumber(now.getMonth() + 1)}-${now.getFullYear()}`;
  const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
  
  this.confirmationService.confirm({
    message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
    header: 'Confirmacion',
    target: event.target as EventTarget,
    icon: 'pi pi-exclamation-triangle',
    accept: () => {
      const userConfirm = this.dniSelected.filter((val:any) => this.selectedProducts?.includes(val));
      userConfirm.forEach((value:any) => {
        const [fila, asiento] = [value.fila,value.asiento]
        value.fecha = currentDate
        value.hora = currentTime
        value.estado = 'pagado'
        value.validado = `${this.admin.nombre} ${this.admin.apellido}`
        
        for (let row of this.allSeats[this.escenario.sala]) {
          if (!row) continue;
          for (let seat of row) {
            if (seat && seat.fila === fila && seat.asiento === asiento) {
              seat.estado = 'pagado';
            }
          }
        }
      })
      this.updateScenario(this.allSeats)
      this.dataService.saveData('jsonData',this.allSeats)
      
      this.reserves = {...this.reserves}
      console.log(this.reserves)
      this.reserves[dni] = this.dniSelected
      console.log(this.reserves[dni])
      this.dataService.saveData('jsonReservation',this.reserves)
      
      this.selectedProducts = null;
      
      const confirm = this.dataService.getData('jsonConfirm')
      confirm[dni] = this.reserves[dni]
      this.dataService.saveData('jsonConfirm',confirm)
      
      this.messageService.add({ severity: 'success', summary: 'Confirmacion Exitosa', detail: 'Reservas eliminadas', life: 3000 });
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
      // this.dniSelected = reserves[user.dni].filter((val:any) => !this.selectedProducts?.includes(val));
      const eliminadas = this.dniSelected.filter((val:any) => this.selectedProducts?.includes(val));
      this.dniSelected = this.dniSelected.filter((val:any) => !this.selectedProducts?.includes(val));
      eliminadas.forEach((value:any) => {
        const [fila, asiento] = [value.fila,value.asiento]
        
        for (let row of this.allSeats[this.escenario.sala]) {
          if (!row) continue;
          for (let seat of row) {
            if (seat && seat.fila === fila && seat.asiento === asiento) {
              seat.estado = 'disponible';
              
            }
          }
        }
      })
      
      this.updateScenario(this.allSeats)
      this.reserves[dni] = this.dniSelected
      this.dataService.saveData('jsonReservation',this.reserves)
      this.dataService.saveData('jsonData',this.allSeats)
      this.selectedProducts = null;
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    }
  });
}
// Fin
//////////////////////////////

updateScenario(data: any) {
  this.scenarioService.notifyScenarioUpdate(data);
}
///////////////////////////////
///////////////////////////////////
// Aqui se quitan todas las reservas por usuario y los asientos vuelven a estar disponible
removeAllReserves(user: any, event: Event) {
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Estas seguro/a que deseas eliminar todas las reservas de este usuario?',
    header: 'Confirmacion de eliminacion',
    icon: 'pi pi-info-circle',
    acceptButtonStyleClass:"p-button-danger p-button-text",
    rejectButtonStyleClass:"p-button-text p-button-text",
    acceptIcon:"none",
    rejectIcon:"none",
    
    accept: () => {
      this.reserves[user.dni].forEach((reserve:any) => {
        const [fila, asiento] = [reserve.fila,reserve.asiento]
        // cambia de estado a reservado solo para en la funcionalidad del usuario
        for (let row of this.allSeats[this.escenario.sala]) {
          if (!row) continue;
          for (let seat of row) {
            if (seat && seat.fila === fila && seat.asiento === asiento) {
              seat.estado = 'disponible';
            }
          }
        }
      })
      this.updateScenario(this.allSeats)
      delete this.reserves[user.dni]
      this.dataService.saveData('jsonReservation',this.reserves)
      this.dataService.saveData('jsonData',this.allSeats)
      this.users = this.users.filter((val:any) => val.dni !== user.dni);
      user = {}
      this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Reservas eliminadas' });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Accion rechazada' });
    }
  });
}

padNumber(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

// Aqui se confirman las reservas y pasan a ser pagadas
acceptAllReserves(user:any,event:Event){
  const now = new Date();
  
  const currentDate = `${now.getFullYear()}-${this.padNumber(now.getMonth() + 1)}-${this.padNumber(now.getDate())}`;
  const currentTime = `${this.padNumber(now.getHours())}:${this.padNumber(now.getMinutes())}`;
  
  this.confirmationService.confirm({
    target: event.target as EventTarget,
    message: 'Estas seguro/a que deseas validar todas las reservas',
    header: 'Confirmacion de eliminacion',
    icon: 'pi pi-exclamation-triangle',
    acceptIcon:"none",
    rejectIcon:"none",
    rejectButtonStyleClass:"p-button-text",
    accept: () => {
      this.reserves[user.dni].forEach((reserve:any) => {
        const [fila, asiento] = [reserve.fila,reserve.asiento]
        reserve.fecha = currentDate
        reserve.hora = currentTime
        reserve.estado = 'pagado'
        reserve.validado = `${this.admin.nombre} ${this.admin.apellido}`
        
        // cambia de estado a reservado solo para en la funcionalidad del usuario
        for (let row of this.allSeats[this.escenario.sala]) {
          if (!row) continue;
          for (let seat of row) {
            if (seat && seat.fila === fila && seat.asiento === asiento) {
              seat.estado = 'pagado';
            }
          }
        }
      })
      this.reserves = {...this.reserves}
      const confirm = this.dataService.getData('jsonConfirm')
      confirm[user.dni] = this.reserves[user.dni]
      user = {...user}
      this.updateScenario(this.allSeats)
      this.dataService.saveData('jsonReservation',this.reserves)
      this.dataService.saveData('jsonConfirm',confirm)
      this.dataService.saveData('jsonData',this.allSeats)
      this.messageService.add({ severity: 'info', summary: 'Confirmado', detail: 'Todas las reservas pasaron a ser confirmadas' });
    },
    reject: () => {
      this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Accion rechazada', life: 3000 });
    }
  });
  
}
// Aqui se quita una reserva indicada por el asiento y fila. Ese asiento vuelve a estar disponible
freeOneReserve(reserve:any){
  
}
// Aqui se confirma una reserva y pasa a ser pagada
acceptOneReserve(reserve:any){
  
}

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

showDialog(dni: any):void{
  // DNISELECTED es el array de reservas de ese dni
  this.aloneDni = dni
  this.dniSelected = this.reserves[dni] || [];
  this.dialogVisible = true;
}
}


