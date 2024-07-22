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

import { DataService } from '../../../core/services/data.service';

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
    FloatLabelModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
  providers:[ConfirmationService,MessageService]
})
export class ManageUsersComponent {

  users: any | undefined

  // dniSelected: any
 
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

  filteredUsers:any

  constructor(private dataService: DataService,
    private confirmationService:ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
    this.ciclos = [{ciclo:"Kinder"},{ciclo:"Primaria"},{ciclo:"Secundaria"}]
    this.divisiones = [{division:"A"},{division:"B"}]
  }

  ngOnInit(){
    this.users = this.dataService.getData('jsonUsers').usuarios
    this.filteredUsers = [...this.users];
    this.concerts = this.dataService.getData('jsonConcerts')["concerts"]

    // Object.keys(allconcerts).forEach(key => {
    //   arr.push(allconcerts[key])
    // })
    // this.concerts = arr
  }

  onCicloChange(selectedCiclo: any) {
    if (selectedCiclo.ciclo === 'Kinder') {
      this.niveles = [
        { nivel: 3 },
        { nivel: 4 },
        { nivel: 5 }
      ];
    } else {
      this.niveles = [
        { nivel: 1 },
        { nivel: 2 },
        { nivel: 3 },
        { nivel: 4 },
        { nivel: 5 },
        { nivel: 6 }
      ];
    }
    // Reset the selected level when ciclo changes
    this.nivelChoice = null;
  }

  verFiltro(){
    this.filteredUsers = this.users.filter((user:any) => {
      return (!this.cicloChoice || user.ciclo === this.cicloChoice.ciclo) &&
             (!this.nivelChoice || user.nivel === this.nivelChoice.nivel) &&
             (!this.divisionChoice || user.division === this.divisionChoice.division);
    });
  }

  habilitar(concert:any,event:Event){
    this.confirmationService.confirm({
      message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.filteredUsers.forEach((element:any) => {
            element.habilitaciones = `${concert.nombre}`

        });
        this.filteredUsers = [...this.filteredUsers]
        this.users.forEach((value:any,index:number) => {
          for(let i = 0; i < this.filteredUsers.length ; i++){
            if (value.dni != this.filteredUsers[i].dni ){
              continue
            }
            this.users[index] = this.filteredUsers[i]
          }
        })
        const u = this.dataService.getData('jsonUsers')
        u.usuarios = this.users
        
        this.dataService.saveData('jsonUsers',u)
        // this.dialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Confirmar', detail: 'Concert modificado', life: 3000 })
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
