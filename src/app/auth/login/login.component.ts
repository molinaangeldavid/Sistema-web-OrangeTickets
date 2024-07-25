import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {NavbarComponent} from '../../shared/components/navbar/navbar.component'
import {FooterComponent} from '../../shared/components/footer/footer.component'

import { AuthService } from '../../core/services/auth.service';
import {CookieService} from 'ngx-cookie-service';

import { ButtonModule } from 'primeng/button';
import { ScenarioService } from '../../core/services/scenario.service';
import { DataService } from '../../core/services/data.service';
import { ReservationService } from '../../core/services/reservation.service';
import { ConcertService } from '../../core/services/concert.service';
import { ConfirmadoService } from '../../core/services/confirmado.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NavbarComponent,
    FooterComponent,
    FormsModule,
    ButtonModule,
    CommonModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  
  //dni ngModel
  dni: any|undefined
  errorDni: boolean = false
  
  //condition input admin
  esAdmin:boolean = false
  errorPassword: boolean = false
  
  //password ngModel
  password: any = ''
  
  concerts: any | undefined
  
  users: any | undefined
  
  scenario: any | undefined
  
  reservas: any | undefined
  
  confirmados: any | undefined
  
  errorMessage: string = '';
  
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService,
    private scenarioService: ScenarioService,
    private dataService: DataService,
    private reservationService: ReservationService,
    private concertService: ConcertService,
    private confirmadoService: ConfirmadoService
  ){
  }
  
  ngOnInit(){    
    this.esAdmin = false
    // const existUsers = this.dataService.getData('jsonUsers')
    
    // this.authService.getDatos().subscribe(data => {
    //   this.users = data;
    //   if(!existUsers){
    //     this.dataService.saveData('jsonUsers',data)
    //   }
    // })
    
    
    const existeData = this.dataService.getData('jsonData')
    this.scenarioService.getScenario().subscribe(value => {
      this.scenario = value
      if(!existeData){
        this.dataService.saveData('jsonData',this.scenario)
      }
    })
    const existConfirmados = this.dataService.getData('jsonConfirm')
    this.confirmadoService.getDatos().subscribe(value => {
      this.confirmados = value
      if(!existConfirmados){
        this.dataService.saveData('jsonConfirm',this.confirmados)
      }
    })
    
    const concerts = this.dataService.getData('jsonConcerts')
    if(!concerts){
      this.concertService.getDatos().subscribe(data => {
        this.concerts = data;
        if(!concerts){
          this.dataService.saveData('jsonConcerts',this.concerts)
        }
      })
    }
    const existeReserva = this.dataService.getData('jsonReservation')
    if(!existeReserva){
      this.reservationService.getReservation().subscribe(value=> {
        this.reservas = value 
        if(!existeReserva){
          this.dataService.saveData('jsonReservation',this.reservas)
        }
      })
    }
  }
  
  async onSubmit(){
    // const igualDNI = this.users.usuarios.find((usuario:any) => this.dni == usuario.dni)
    // const dniAdmin = this.users.admin.find((value:any) => this.dni == value.dni)
    try {
      const tokenUser = await firstValueFrom(this.authService.authUser(this.dni))
      console.log(tokenUser)
      if(tokenUser){
        this.cookieService.set("dni",`${this.dni}`);
        this.cookieService.set("token",tokenUser);
        this.router.navigate(['home'])
      }
    } catch (error:any) {
      if (error.status === 401) {
        console.log( error.error.message)
        this.errorDni = true
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    }
    
  }
}

