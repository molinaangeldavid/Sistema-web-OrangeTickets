import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { DataService } from '../../../core/services/data.service';

@Component({
  selector: 'app-manage-users',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    DialogModule
  ],
  templateUrl: './manage-users.component.html',
  styleUrl: './manage-users.component.css'
})
export class ManageUsersComponent {

  users: any | undefined

  dniSelected: any
 
  dialogVisible: boolean = false

  constructor(private dataService: DataService){
    
  }

  ngOnInit(){
    this.users = this.dataService.getData('jsonUsers')
  }

  showDialog(dni:any){
    this.dniSelected = dni
    this.dialogVisible = true
  }

}
