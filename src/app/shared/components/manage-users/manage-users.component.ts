import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


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
    ConfirmDialogModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
  providers:[ConfirmationService,MessageService]
})
export class ManageUsersComponent {

  users: any | undefined

  dniSelected: any
 
  dialogVisible: boolean = false
  dialogVisible2: boolean = false

  concerts: any

  result: any[] = [];
  constructor(private dataService: DataService,
    private confirmationService:ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,

  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
  }

  ngOnInit(){
    this.users = this.dataService.getData('jsonUsers').usuarios
    const arr:any = []
    const allconcerts = this.dataService.getData('jsonConcerts')

    Object.keys(allconcerts).forEach(key => {
      arr.push(allconcerts[key])
    })
    this.concerts = arr

  }

  habilitar(concert:any,event:Event){
    this.confirmationService.confirm({
      message: 'Estas seguro/a de confirmar las reservas seleccionadas?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.users.forEach((element:any) => {
          if(element.dni == this.dniSelected){
            element.habilitaciones = `${concert}`
            console.log(this.users)
          }
        });
        this.users = [...this.users]
        const u = this.dataService.getData('jsonUsers')
        u.usuarios = this.users
        
        this.dataService.saveData('jsonUsers',u)
        this.dialogVisible = false
        this.messageService.add({ severity: 'success', summary: 'Confirmar', detail: 'Concert modificado', life: 3000 })
      },
      reject: () => {
        this.messageService.add({severity: 'reject', summary: 'Rechazar', detail: 'No se modifico', life: 3000})
      }
    })
  }

  showDialog(dni:any){
    this.dniSelected = dni
    this.dialogVisible = true
  }

}
