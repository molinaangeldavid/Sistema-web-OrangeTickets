import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FloatLabelModule } from 'primeng/floatlabel';
import { CheckboxModule } from 'primeng/checkbox';

import { DataService } from '../../../core/services/data.service';
import { ConcertService } from '../../../core/services/concert.service';
import { HabilitacionesService } from '../../../core/services/habilitaciones.service';

// interface User{
//   anio:number,
//   apellido: string,
//   ciclo: string,
//   division: string,
//   dni: number,
//   evento_id: number,
//   habilitado: number,
//   habilitadoant: number,
//   nombre: string
// }

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule,
    IconFieldModule,
    InputTextModule,
    InputIconModule,
    ConfirmDialogModule,
    FormsModule,
    DropdownModule,
    CalendarModule,
    FloatLabelModule,
    CheckboxModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
  providers:[ConfirmationService,MessageService]
})
export class ManageUsersComponent {
  
  habilitarDiv: boolean = false;
  deshabilitarDiv: boolean = false;
  
  users: any | undefined
  
  concerts: any | undefined
  concertChoice: any | undefined
  
  ciclos: any
  cicloChoice: any 
  
  niveles:any
  nivelChoice: any
  
  divisiones: any
  divisionChoice: any
  
  dateFrom: Date | undefined
  dateTo: Date | undefined
  minDateTo: Date | undefined
  today: Date = new Date();
  
  filteredUsers:any
  
  habilitaciones: any
  
  loading: boolean = true;
  


  constructor(private dataService: DataService,
    private confirmationService:ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private concertService: ConcertService,
    private habilitacionesService: HabilitacionesService
  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
  }
  
  ngOnInit(){
    this.loadData() 
    this.ciclos = [{ciclo:"Todos"},{ciclo:"Kinder"},{ciclo:"Primario"},{ciclo:"Secundario"}]
    this.divisiones = [{division:"Todos"},{division:"A"},{division:"B"}]
    this.niveles = [{ nivel: "Todos" }];
    this.cicloChoice = this.ciclos[0];
    this.nivelChoice = this.niveles[0];
    this.divisionChoice = this.divisiones[0];
    
  }
  
  loadData(){
    
    /* this.adminService.getAllUsers().subscribe(users => {
    this.users = users
    this.filteredUsers = [...this.users];
    this.loading = false;
    }) */
    this.concertService.getEvents().subscribe(concerts => {
      this.concerts = concerts
    })
    /*
    this.habilitacionesService.getAllHabilitation().subscribe(h => {
    this.habilitaciones = h
    })*/ 
  }
  
  onCicloChange(selectedCiclo: any) {
    if (selectedCiclo.ciclo === 'Kinder') {
      this.niveles = [
        { nivel: "Todos" },
        { nivel: 3 },
        { nivel: 4 },
        { nivel: 5 }
      ];
    } else {
      this.niveles = [
        { nivel: "Todos" },
        { nivel: 1 },
        { nivel: 2 },
        { nivel: 3 },
        { nivel: 4 },
        { nivel: 5 },
        { nivel: 6 }
      ];
    }
    // Reset the selected level when ciclo changes
    this.nivelChoice = this.niveles[0]
  }
  
  verFiltro(){
    this.habilitacionesService.getHabilitacionesFilter(this.concertChoice.id,this.cicloChoice.ciclo,this.nivelChoice.nivel,this.divisionChoice.division).subscribe(users => {
      this.filteredUsers = users
    })
    /* if(this.cicloChoice.ciclo == "Todos" || this.divisionChoice == "Todos"){
    this.filteredUsers = this.users
    }else{
    this.filteredUsers = this.users.filter((user:any) => {
    return (!this.cicloChoice || user.ciclo === this.cicloChoice.ciclo) &&
    (!this.nivelChoice || user.nivel === this.nivelChoice.anio) &&
    (!this.divisionChoice || user.division === this.divisionChoice.division);
    });
    } */
  }
  
  canHabilitar(user:any,event:any){
    const checkbox = event.target;
    const wasChecked = checkbox.checked;
    
    // checkbox.disabled = true;
    
    const habilitado = wasChecked
    
    const desde = this.dateFrom
    const hasta = this.dateTo
    if(!desde || !hasta){
      alert('Debes configurar la fecha de inicio y de fin')
      checkbox.checked = false
      checkbox.disabled = false
    }
    
    user.habilitado = (checkbox.checked?1:0);
    
  }
  
  onDateFromChange(){
    if (this.dateFrom) {
      // Crear una nueva fecha y agregar un día
      this.minDateTo = new Date(this.dateFrom);
      this.minDateTo.setDate(this.minDateTo.getDate() + 1);
      
      // Opcional: Si dateTo ya tiene un valor, ajustarlo para que esté dentro del nuevo rango
      if (this.dateTo && this.dateTo < this.minDateTo) {
        this.dateTo = undefined; // O puedes establecerlo a minDateTo si prefieres
      }
    }
  }

  // habilitar(users:any){
  //   this.habilitacionesService.postHabilitacion(this.concertChoice.id,this.dateFrom,this.dateTo,users).subscribe({
  //     next: (response) => {
  //       console.log(response)
  //     },
  //     error: (error) => {
  //       console.log(error)
  //     }
  //   })
  // }

  toggleHabilitation(event:any){
    // this.confirmationService.confirm({
    //   message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
    //   header: 'Confirmacion',
    //   target: event.target as EventTarget,
    //   icon: 'pi pi-exclamation-triangle',
    //   accept: () => {
    //     console.log(this.filteredUsers)
    //     this.habilitacionesService.postHabilitacion(this.concertChoice.id,this.dateFrom,this.dateTo,this.filteredUsers).subscribe({
    //       next: (response) => {
    //         this.filteredUsers = [...this.filteredUsers]
    //         console.log(response)
    //         this.messageService.add({ severity: 'success', summary: 'Habilitado', detail: 'Usuario habilitado', life: 3000 })
    //       },
    //       error: (error:any) => {
    //         console.log(error)
    //         this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al habilitar', life: 3000})
    //       },
    //     })
    //   },
    //   reject: () => {
    //     this.messageService.add({severity: 'reject', summary: 'Rechazar', detail: 'No se modifico', life: 3000})
    //   }
    // })
  }

  habilitar(event: any){
    const rango: any = {rango: {desde: this.dateFrom, 
                                hasta: this.dateTo
                              }
                        }
    const habilitados:any = {habilita: []}
    const deshabilitados: any = {deshabilita: []}
    this.filteredUsers.forEach((user:any) => {
      if(user.habilitado === 1 && user.habilitadoant != user.habilitado){
        habilitados.habilita.push(user)
      }else{
        if(user.habilitado === 0 && user.habilitadoant != user.habilitado){
          deshabilitados.deshabilita.push(user)
        }
      }
    })
    const data = {habilita:habilitados.habilita,deshabilita: deshabilitados.deshabilita,rango: rango.rango}
    console.log(data)
    this.confirmationService.confirm({
      message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.habilitacionesService.postHabilitacion(this.concertChoice.id,data).subscribe({
          next: (response) => {
            this.filteredUsers = [...this.filteredUsers]
            console.log(response)
            this.messageService.add({ severity: 'success', summary: 'Habilitado', detail: 'Usuario habilitado', life: 3000 })
          },
          error: (error:any) => {
            console.log(error)
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al habilitar', life: 3000})
          },
        })
      },
      reject: () => {
        this.messageService.add({severity: 'reject', summary: 'Rechazar', detail: 'No se modifico', life: 3000})
      }
    })
  }





// showDialog(dni:any){
//   this.dniSelected = dni
//   this.dialogVisible = true
// }

}
