import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { DataService } from '../../../core/services/data.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ToolbarModule } from 'primeng/toolbar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { AdminService } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    FormsModule,
    ToolbarModule,
    ConfirmDialogModule,
    ButtonModule,
    ToastModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    InputNumberModule,
    DropdownModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css',
  providers: [MessageService,ConfirmationService]
})
export class AdminManageComponent {
  
  administradores:any
  
  administrador:any
  selectedAdministrador: any
  administradorDialog: boolean = false
  
  submitted: boolean = false
  
  constructor(
    private messageService: MessageService, 
    private confirmationService: ConfirmationService,
    private adminService: AdminService
  ){
  }
  
  ngOnInit(){
    this.administrador = {
      dni: undefined,
      nombre: "",
      apellido: "",
      pass: "",
    }
    this.adminService.getAdmins().subscribe(e => {
      this.administradores = e
    })
  }
  
  new(){
    this.administrador = {};
    this.submitted = false;
    this.administradorDialog = true;
  }
  
  editAdministrador(administrador:any){
    this.administrador = { ...administrador };
    this.administradorDialog = true;
  }
  
  deleteSelectedAdministrador(){
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar estos concerts?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.administradores = this.administradores.filter((val:any) => !this.selectedAdministrador?.includes(val));
        
        this.selectedAdministrador = null;
        this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Administradores eliminados', life: 3000 });
      },
      reject: () => {
        this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Accion rechazada', life: 3000 });
      }
    });
    
  }
  
  // findIndexById(id: string): number {
  //   let index = -1;
  //   for (let i = 0; i < this.administradores.length; i++) {
  //     if (this.administradores[i].id === id) {
  //       index = i;
  //       break;
  //     }
  //   }
  //   return index;
  // }
  
  // createId(): string {
  //   let maxId = 0;
  //   for (const concert of this.administradores) {
  //     if (concert.id > maxId) {
  //       maxId = parseInt(concert.id);
  //     }
  //   }
  //   return `${maxId + 1}`;
  // }
  
  saveAdministrador(){
    this.submitted = true;
    if (this.administrador!.dni) {
      console.log("hola")
      this.adminService.putAdmin(this.administrador.dni, this.administrador).subscribe({
        next: (response) => {
          console.log(response)
        },
        error: (error) => {
          console.log(error)
        }
      })
      this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert actualizado', life: 3000 });
    } else {
      this.administradores.push(this.administrador!);
      this.adminService.postAdmin(this.administrador).subscribe({
        next: (response) => {
          console.log(response)
        },
        error: (error) => {
          console.log(error)
        }
      })
      this.administrador = {}
      this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert creado', life: 3000 });
    }
    
    this.administradores = [...this.administradores];
    this.administradorDialog = false;
    this.administrador! = {};
  }
  
  hideDialog() {
    this.administradorDialog = false;
    this.submitted = false;
  }
  deleteAdministrador(administrador: any) {
    this.confirmationService.confirm({
      message: 'Estas seguro de eliminar ' + administrador.nombre + ' ?',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // let concertRemoved = this.concerts.filter((val: any) => val.id == concert.id)
        this.adminService.deleteAdmin(administrador.id).subscribe({
          next: (response) => {
            console.log(response)
            this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Concert Eliminado', life: 3000 });
          },
          error: (error) => {
            console.log(error)
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminarse el evento', life: 3000 });
          }
        })
        this.administradores = this.administradores.filter((val:any) => val.id !== administrador.id);
        this.administrador = {};
      }
    });
  }
  
}
