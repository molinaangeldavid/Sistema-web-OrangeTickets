import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ReservatedComponent } from "../../shared/components/reservated/reservated.component";
import { ScenarioComponent } from "../../shared/components/scenario/scenario.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { Subscription } from 'rxjs';
import { ShowComponentService } from '../../core/services/show-component.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../core/services/auth.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';

import { DropdownModule } from 'primeng/dropdown';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    ReservatedComponent,
    ScenarioComponent,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]  
  
})
export class HomeComponent implements OnInit,OnDestroy {
  
  private subscription: Subscription | undefined;
  
  currentComponent: string | undefined 
  
  dni: any | undefined
  // Concierto elegido por el usuario
  concertChoice: any | undefined
  //
  // Todos los conciertos
  concerts: any | undefined
  //Concerts de localStorage
  allConcerts: any | undefined
  //La data de los usuarios
  dataUsers: any[] | undefined
  
  usuario:any={}
  
  usuarios: any
  
  admin: boolean = false

  constructor(
    private showComponentService: ShowComponentService,
    private cookieService: CookieService,
    private authService: AuthService,
    private dataService: DataService
  ){
  }
  
  async ngOnInit(){
    this.dni = this.cookieService.get("dni")
    this.allConcerts = this.dataService.getData("jsonConcerts")
    this.currentComponent! = 'scenario'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })
    this.authService.getUser(this.dni).subscribe(user => {
      this.usuario = user
      this.concerts = this._searchScenario()
    })

  }
  
  changePage(value:any){
    this.currentComponent = value
  }

  private _searchScenario(){
    const concerts:any = []
    for(let i = 0; i < this.usuario.habilitaciones.length;i++){
      const c = this.usuario.habilitaciones[i]
      concerts.push(this.allConcerts[c])
    }
    return concerts
  }


ngOnDestroy(): void {
  this.subscription?.unsubscribe()
}


}
