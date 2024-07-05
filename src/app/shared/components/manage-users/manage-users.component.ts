import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../core/services/data.service';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule,
    ButtonModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {

  users: any | undefined

  dniSelected: any
 
  dialogVisible: boolean = false
  dialogVisible2: boolean = false

  concerts: any

  constructor(private dataService: DataService){
    
  }

  ngOnInit(){
    const arr:any = []
    const allconcerts = this.dataService.getData('jsonConcerts')
    Object.keys(allconcerts).forEach(key => {
      arr.push(allconcerts[key])
    })
    this.concerts = arr

    this.users = this.dataService.getData('jsonUsers').usuarios
  }

  habilitar(dni:any,event:Event){
    
  }
  deshabilitar(dni:any,event:Event){

  }

  showDialog(dni:any){
    this.dialogVisible = true
  }
  showDialog2(dni:any){
    this.dniSelected = dni
    this.dialogVisible2 = true
  }

}
