import { Component } from '@angular/core';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ScenarioComponent } from '../../shared/components/scenario/scenario.component';
import { ManageUsersComponent } from '../../shared/components/manage-users/manage-users.component';

import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ShowComponentService } from '../../core/services/show-component.service';
import { ManageReservesComponent } from '../../shared/components/manage-reserves/manage-reserves.component';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ScenarioComponent,
    ManageUsersComponent,
    ManageReservesComponent,
    TableModule,
    CommonModule,
    ButtonModule
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css'
})
export class HomeAdminComponent {

  dniSelected: any | undefined


  currentComponent: string | undefined 
  private subscription: Subscription | undefined;

  constructor(
    private showComponentService: ShowComponentService,
    private dataService: DataService,
    private authService:AuthService
  ){

  }

  ngOnInit(){
    this.currentComponent! = 'reserveManage'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })
  }


}
