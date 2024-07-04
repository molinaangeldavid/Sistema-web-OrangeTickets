import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/services/auth.service';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';


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
    InputTextModule
  ],
  templateUrl: './manage-reserves.component.html',
  styleUrl: './manage-reserves.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA],
})
export class ManageReservesComponent {

  users: any | undefined

  reserves: any | undefined

  dialogVisible: boolean = false;

  dniSelected: any | undefined

  constructor(
    private dataService: DataService,
    private authService:AuthService
  ){
    
  }

  ngOnInit(){
    this.reserves = this.dataService.getData('jsonReservation')
    this.authService.getDatos().subscribe(users => {
      this.users = users.usuarios
    })
  }

  showDialog(dni: any):void{
    this.dniSelected = this.reserves[dni] || [];
    this.dialogVisible = true;
  }

}
