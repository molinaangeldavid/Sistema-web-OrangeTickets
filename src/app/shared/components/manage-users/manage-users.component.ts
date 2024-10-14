import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Table, TableModule } from 'primeng/table';
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
import { FileUploadModule} from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';

import { ConcertService } from '../../../core/services/concert.service';
import { HabilitacionesService } from '../../../core/services/habilitaciones.service';
import { AdminService } from '../../../core/services/admin.service';

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
    CheckboxModule,
    FileUploadModule,
    InputNumberModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css',
  providers:[ConfirmationService,MessageService]
})
export class ManageUsersComponent {
  
  @ViewChild('dt') dt: Table | undefined;
  // All users
  users: any | undefined
  
  ////////////
  // Filter
  concerts: any | undefined
  concertChoice: any | undefined = undefined
  
  ciclos = [{ciclo:"Todos"},{ciclo:"Kinder"},{ciclo:"Primaria"},{ciclo:"Secundaria"}]
  cicloChoice: any 
  
  niveles:any
  nivelChoice: any
  
  divisiones = [{division:"Todos"},{division:"A"},{division:"B"}]
  divisionChoice: any
  ////////////////////
  loadingHabilitados: boolean = true
  loadingdeshabilitados: boolean = true
  // input date
  dateFrom: Date | undefined
  dateTo: Date | undefined
  timeFrom: any
  timeTo:any
  
  minDateTo: Date | undefined
  today: Date = new Date();
  // Input cantidad
  
  startDateTime: Date | null = null;
  endDateTime: Date | null = null;
  
  cantidad: any

  // All users for habilitation  
  selectedUsers: any
  // All Users for deshabilitation
  selectedHabilitaciones: any
  
  // All habilitation
  habilitaciones: any
  
  // Loading spinner
  loading: boolean = true;
  
  // file para subir
  file: any
  
  // 
  allSelected: boolean = false;
  
  // Condition to show divs
  habilitarOptionBoolean: boolean = true
  deshabilitarOptionBoolean: boolean = false
  
  dniFilter: any

  filteredUsers: any;
  

  displayConflictsDialog: boolean = false; // Controla la visibilidad del dialog
  conflictos: any[] = []; // Lista para almacenar los conflictos de habilitación

  constructor(
    private confirmationService:ConfirmationService,
    private messageService: MessageService,
    private primengConfig: PrimeNGConfig,
    private concertService: ConcertService,
    private habilitacionesService: HabilitacionesService,
    private adminService: AdminService
  ){
    this.primengConfig.setTranslation({
      accept: 'Sí',
      reject: 'No',
    });
  }
  
  ngOnInit(){
    this.loadData()
    this.niveles = [{ nivel: "Todos" }];
    this.cicloChoice = this.ciclos[0];
    this.nivelChoice = this.niveles[0];
    this.divisionChoice = this.divisiones[0];
    this.dniFilter = "Todos"
    this.adminService.getAllEstudiantes(this.cicloChoice.ciclo.toLowerCase(),this.nivelChoice.nivel,this.divisionChoice.division,this.dniFilter).subscribe({
      next: (value) => {
        this.users = value
        this.filteredUsers = this.users
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.loadingHabilitados = false
      }
    })
  }
  
  loadData(){
    this.concertService.getEvents().subscribe({
      next: (value) => {
        this.concerts = value.map((event: any) => {
          const fecha = new Date(event.fecha);
          const opcionesFecha: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
          return {
            ...event,
            displayLabel: `${event.nombre} - ${fecha.toLocaleDateString('es-ES', opcionesFecha)} ${event.hora}`
          }

        })
      },
      error: (error) => {
        console.log(error)
      },
    })
  }
  
  onCicloChange(selectedCiclo: any) {
    if (selectedCiclo.ciclo === 'Kinder') {
      this.niveles = [
        { nivel: "Todos" },
        { nivel: 2 },
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
    this.nivelChoice = this.niveles[0]
  }
  
  setFiltro(){
    this.loadingHabilitados = true
    this.adminService.getAllEstudiantes(this.cicloChoice.ciclo.toLowerCase(),this.nivelChoice.nivel,this.divisionChoice.division,this.dniFilter).subscribe({
      next: (value) => {
        this.filteredUsers = value
        this.selectedUsers = value
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.loadingHabilitados = false
      }
    });
  }

  verFiltro(){
    this.loadingdeshabilitados = true
    this.habilitacionesService.getHabilitacionesFilter(this.concertChoice.id,this.cicloChoice.ciclo.toLowerCase(),this.nivelChoice.nivel,this.divisionChoice.division,this.dniFilter).subscribe({
      next: (value) => {
        if (value && value.length > 0) {
          this.habilitaciones = value;
        } else {
          alert(value.msg || 'No se encontraron habilitaciones');
          this.habilitaciones = []; // Limpia las habilitaciones si no hay datos.
        }
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.loadingdeshabilitados = false
      }
    })
  }
  
  habilitarOption(){
    this.loadingHabilitados = true
    this.deshabilitarOptionBoolean = false
    this.habilitarOptionBoolean = true
    this.adminService.getAllEstudiantes(this.cicloChoice.ciclo.toLowerCase(),this.nivelChoice.nivel,this.divisionChoice.division,this.dniFilter).subscribe({
      next: (value) => {
        this.users = value
        this.filteredUsers = this.users
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.loadingHabilitados = false
      }
    })
  }
  
  deshabilitarOption(){ 
    if(!this.concertChoice){
      alert('Selecciona un evento para deshabilitar')
      return
    }
    this.loadingdeshabilitados = true
    this.habilitarOptionBoolean = false
    this.deshabilitarOptionBoolean = true
    this.habilitacionesService.getHabilitacionesFilter(this.concertChoice.id,this.cicloChoice.ciclo.toLowerCase(),this.nivelChoice.nivel,this.divisionChoice.division,this.dniFilter).subscribe({
      next: (value) => {
        if (value && value.length > 0) {
          this.habilitaciones = value;
        } else {
          alert(value.msg || 'No se encontraron habilitaciones');
          this.habilitaciones = []; // Limpia las habilitaciones si no hay datos.
        }
      },
      error: (error) => {
        console.log(error)
      },
      complete: () => {
        this.loadingdeshabilitados = false
      }
    })
  }
  
  onFileSelect(event: {files: File[]}){
    this.file = event.files[0];
  }
  
  uploadFile(fileUpload:any){
    if(this.file){
      this.adminService.uploadUser(this.file).subscribe({
        next: (response) => {
          console.log(response)
          fileUpload.clear()
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Usuarios agregados a la base de datos', life: 3000 })
        },
        error: (error) => {
          console.log(error)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos', life: 3000 })
        }
      })
    }
  }
  
  canHabilitar() {
    if (!this.concertChoice) return false;
  
    if (!this.dateFrom || !this.timeFrom || !this.dateTo || !this.timeTo) return false;
  
    if (!this.cantidad || this.cantidad <= 0) return false;
  
    return true;
  }
  
  combineDateAndTime(date: Date, time: Date): Date {
    const combined = new Date(date);
    combined.setHours(time.getHours(), time.getMinutes(), time.getSeconds());
    return combined;
  }

  onDateFromChange(){
    if (this.dateFrom && this.timeFrom) {
      this.startDateTime = this.combineDateAndTime(this.dateFrom, this.timeFrom);
    }
  }
  
  onDateToChange() {
    if (this.dateTo && this.timeTo) {
      this.endDateTime = this.combineDateAndTime(this.dateTo, this.timeTo);
    }
  }

  habilitar(event: any){
    if(this.cicloChoice.ciclo == "Todos" || this.nivelChoice.nivel == "Todos" || this.divisionChoice.division == "Todos" || this.dniFilter == "Todos"){
      alert("Estas queriendo habilitar a todos los usuarios. Estas seguro/a?\nFiltra los estudiantes por ciclo, nivel y division o dni")
    }
    const rango = {
        desde: this.startDateTime,
        hasta: this.endDateTime
    }
    const habilitados:any = this.selectedUsers
    const deshabilitados: any = undefined

    const data = {habilitados,deshabilitados, rango, cantidad: this.cantidad}
    this.confirmationService.confirm({
      message: 'Estas seguro/a de habilitar los usuarios de la tabla?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.habilitacionesService.postHabilitacion(this.concertChoice.id,data).subscribe({
          next: (response) => {
            console.log(response)
            this.messageService.add({ severity: 'success', summary: 'Habilitado', detail: 'Usuario habilitado', life: 3000 })
          },
          error: (error:any) => {
            if (error.error && error.error.conflictos && error.status == 400) {
              // Error de conflicto
              this.conflictos = error.error.conflictos;
              this.displayConflictsDialog = true;
            } else {
              // Otro tipo de error
              console.error('Error al habilitar estudiantes:', error);
              alert("Error al habilitar. Comunicarse con el Desarrollador")
            }
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al habilitar', life: 3000})
          },
        })
      },
      reject: () => {
        this.messageService.add({severity: 'reject', summary: 'Rechazar', detail: 'No se modifico', life: 3000})
      }
    })
  }
  
  deshabilitar(event:any){
    if(this.cicloChoice.ciclo == "Todos" || this.nivelChoice.nivel == "Todos" || this.divisionChoice.division == "Todos" || this.dniFilter == "Todos"){
      alert("Estas queriendo deshabilitar a todos los usuarios. Estas seguro/a?\nFiltra los estudiantes por ciclo, nivel y division o dni")
    }
    console.log(this.selectedHabilitaciones)
    const deshabilitados: any = this.selectedHabilitaciones
    const habilitados:any = undefined

    const data = {habilitados,deshabilitados}

    this.confirmationService.confirm({
      message: 'Estas seguro/a de eliminar las habilitaciones seleccionadas?',
      header: 'Confirmacion',
      target: event.target as EventTarget,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.habilitacionesService.postHabilitacion(this.concertChoice.id,data).subscribe({
          next: (response) => {
            console.log(response)
            this.habilitaciones = this.habilitaciones.filter((hab:any) => 
              !deshabilitados.some((deshab: any) => deshab._id === hab._id)
            );
            this.messageService.add({ severity: 'success', summary: 'DesHabilitacion', detail: 'Habilitacion/es eliminada/s', life: 3000 })
          },
          error: (error:any) => {
            console.log(error)
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error al deshabilitar', life: 3000})
          },
        })
      },
      reject: () => {
        this.messageService.add({severity: 'reject', summary: 'Rechazar', detail: 'No se eliminaron', life: 3000})
      }
    })


  }
  
}
