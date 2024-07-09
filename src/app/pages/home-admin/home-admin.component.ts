import { CUSTOM_ELEMENTS_SCHEMA, Component, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ScenarioComponent } from '../../shared/components/scenario/scenario.component';
import { ManageUsersComponent } from '../../shared/components/manage-users/manage-users.component';
import { ManageReservesComponent } from '../../shared/components/manage-reserves/manage-reserves.component';
import { CountCashComponent } from '../../shared/components/count-cash/count-cash.component';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CardModule } from 'primeng/card';

import { ShowComponentService } from '../../core/services/show-component.service';
import { DataService } from '../../core/services/data.service';
import { CookieService } from 'ngx-cookie-service';

import { Subscription } from 'rxjs';



@Component({
  selector: 'app-home-admin',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    ScenarioComponent,
    ManageUsersComponent,
    ManageReservesComponent,
    CountCashComponent,
    FormsModule,
    TableModule,
    CommonModule,
    ButtonModule,
    DropdownModule,
    CardModule
  ],
  templateUrl: './home-admin.component.html',
  styleUrl: './home-admin.component.css',
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeAdminComponent {

  usuario: any

  admin: boolean = true

  concerts: any | undefined
  concertChoice: any | undefined

  currentComponent: string | undefined 

  reservation: any | undefined

  dni: any | undefined

  private subscription: Subscription | undefined;

  constructor(
    private showComponentService: ShowComponentService,
    private dataService: DataService,
    private cookieService: CookieService
  ){}

  ngOnInit(){
    this.currentComponent! = 'reserveManage'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })
    this.concerts = this.dataService.getData("jsonConcerts")
    this.concerts = this._searchScenario()
    this.dni = this.cookieService.get('dniAdmin')
    this.usuario = this._usuario()
  }

  private _usuario(){
    const user = this.dataService.getData('jsonUsers')['admin']
    const getAdmin = user.find((elem: any) => elem.dni == this.dni)
    return getAdmin
  }

  private _searchScenario(){
    const concerts:any = []
    for(let i in this.concerts){
      const c = this.concerts[i]
      concerts.push(c)
    }
    return concerts
  }

}
