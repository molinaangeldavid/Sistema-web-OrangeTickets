import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ReservatedComponent } from "../../shared/components/reservated/reservated.component";
import { ScenarioComponent } from "../../shared/components/scenario/scenario.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

import { Subscription } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { ShowComponentService } from '../../core/services/show-component.service';
import { DataService } from '../../core/services/data.service';
import { AuthService } from '../../core/services/auth.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';

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
    DropdownModule,
    CardModule
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
  
  menusecreto:any
  menusecretonada: any

  constructor(
    private showComponentService: ShowComponentService,
    private cookieService: CookieService,
    private authService: AuthService,
    private dataService: DataService
  ){
  }
  
  async ngOnInit(){
    this.dni = this.cookieService.get("dni")
    this.allConcerts = this.dataService.getData("jsonConcerts")["concerts"]
    this.currentComponent! = 'scenario'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })
    const usuario = this.dataService.getData('jsonUsers').usuarios

    this.usuario = usuario.find((u:any) => u.dni == this.dni)
    // const concert = this.usuario.habilitaciones
    // this.concertChoice = this.allConcerts[concert]
    const concert = this.usuario?.habilitaciones;
    this.concertChoice = this.allConcerts.find((value:any) => value.nombre === concert)
    console.log(this.concertChoice)
    // if (this.concertChoice === null) {
    //   this.menusecretonada = true;
    // } else {
    //   this.menusecreto = true;
    // }

    
  }
  
  changePage(value:any){
    this.currentComponent = value
  }
  // Elige todos los conciertos que tiene el dni - deshabilitado por el momento
  // private _searchScenario(){
  //   const concerts:any = []
  //   for(let i = 0; i < this.usuario.habilitaciones.length;i++){
  //     const c = this.usuario.habilitaciones[i]
  //     concerts.push(this.allConcerts[c])
  //   }
  //   return concerts
  // }
  
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
  
  
}
