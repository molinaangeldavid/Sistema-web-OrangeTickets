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
import { FileUploadModule} from 'primeng/fileupload';

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
    FileUploadModule
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
  
  file: any

  allSelected: boolean = false;
  
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
    this.ciclos = [{ciclo:"Todos"},{ciclo:"Kinder"},{ciclo:"Primario"},{ciclo:"Secundario"}]
    this.divisiones = [{division:"Todos"},{division:"A"},{division:"B"}]
    this.niveles = [{ nivel: "Todos" }];
    this.cicloChoice = this.ciclos[0];
    this.nivelChoice = this.niveles[0];
    this.divisionChoice = this.divisiones[0];
    
  }
  
  loadData(){
    this.concertService.getEvents().subscribe(concerts => {
      this.concerts = concerts
    })
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

  onFileSelect(event: {files: File[]}){
    this.file = event.files[0];
  }

  uploadFile(){
    if(this.file){
      this.adminService.uploadUser(this.file).subscribe({
        next: (response) => {
          console.log(response)
          this.messageService.add({ severity: 'success', summary: 'Exito', detail: 'Usuarios agregados a la base de datos', life: 3000 })
        },
        error: (error) => {
          console.log(error)
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los archivos', life: 3000 })
        }
      })
    }
  }

  toggleAll(event: Event) {
    const desde = this.dateFrom; 
  const hasta = this.dateTo;

  if (this.allSelected && (!desde || !hasta)) {
    // Mostrar alerta si las fechas no están configuradas
    alert('Debes configurar la fecha de inicio y de fin antes de habilitar a todos los usuarios.');
    // Desmarcar el checkbox general si las fechas no están configuradas
    this.allSelected = false;
    // Evitar que los checkboxes se habiliten
    event.preventDefault();
    return;
  }
    this.filteredUsers.forEach((user:any) => {
      user.habilitado = this.allSelected ? 1 : 0;
    });
  }

  canHabilitar(user: any, event: any) {
    const checkbox = event.target;
    const desde = this.dateFrom; 
    const hasta = this.dateTo; 
  
    if (checkbox.checked && (!desde || !hasta)) {
      // Mostrar alerta si las fechas no están configuradas
      alert('Debes configurar la fecha de inicio y de fin antes de habilitar al usuario.');
      checkbox.checked = false
      // Evitar que el checkbox se habilite
      event.preventDefault();
      return;
    }
  
    // Asignar el estado del checkbox al usuario si las fechas están configuradas o si se está deshabilitando
    user.habilitado = checkbox.checked ? 1 : 0;
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

}
