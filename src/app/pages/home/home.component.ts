import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';
import { ReservatedComponent } from "../../shared/components/reservated/reservated.component";
import { ScenarioComponent } from "../../shared/components/scenario/scenario.component";
import { ReservationComponent } from "../../shared/components/reservation/reservation.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";
import { Observable, Subject, Subscription, map } from 'rxjs';
import { ShowComponentService } from '../../core/services/show-component.service';
import { CommonModule } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    ReservatedComponent,
    ScenarioComponent,
    ReservationComponent,
    NavbarComponent,
    FooterComponent,
    CommonModule
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ]  
  
})
export class HomeComponent implements OnInit,OnDestroy {
  
  currentComponent: string | undefined 
  private subscription: Subscription | undefined;
  
  dni: any | undefined
  
  dataConcert = {
    concert: "La Cage Aux Queens",
    fecha: "2-12-2024",
    horario: "8:45",
    sala: "Kinder"
  }

  dataUsers: any[] | undefined

  usuario:any={}

  usuarios: any

  escenario: any
  

  constructor(
    private showComponentService: ShowComponentService,
    private cookieService: CookieService,
    private authService: AuthService
  ){
  }
  
  ngOnInit(){
    this.dni = this.cookieService.get("dni")

    this.currentComponent! = 'scenario'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })

    this.escenario = true
    // this.escenario2 = true


    // this.authService.getDatos().subscribe(data=>{
    //   this.usuarios = data
    // },error=>{
    //   console.log(error)
    // })

    this.authService.getUser(this.dni).subscribe(user => {
      this.usuario = user
    })
  }
   
  changePage(value:any){
    this.currentComponent = value
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
  
  
}
