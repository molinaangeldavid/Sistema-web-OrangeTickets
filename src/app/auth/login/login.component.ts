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
  errorDni: boolean | undefined = false
  
  //condition input admin
  esAdmin:boolean | undefined
  errorPassword: boolean | undefined = false
  
  //password ngModel
  password: any | undefined
  
  data: any
  
  scenario: any | undefined
  
  reservas: any | undefined
  
  constructor(
    private cookieService: CookieService,
    private router: Router,
    private authService: AuthService,
    private scenarioService: ScenarioService,
    private dataService: DataService,
    private reservationService: ReservationService
  ){
  }
  
  ngOnInit(){    
    this.dni = ""
    this.esAdmin = false
    this.password = ""
    const users = this.dataService.getData('jsonUsers')
    if(!users){
      this.authService.getDatos().subscribe(data => {
        this.data = data;
        this.dataService.saveData('jsonUsers',this.data)
      })
    }
    const existeData = this.dataService.getData('jsonData')
    if(!existeData){
      this.scenarioService.getScenario().subscribe(value => {
        this.scenario = value
        this.dataService.saveData('jsonData',this.scenario)
      })
    }
    // const existeData2 = this.dataService.getData('jsonData2')
    // if(!existeData2){
    //   this.scenarioService.getScenario2().subscribe(value => {
    //     this.scenario = value
    //     this.dataService.saveData('jsonData2',this.scenario)
    //   })
    // }
    const existeReserva = this.dataService.getData('jsonReservation')
    if(!existeReserva){
      this.reservationService.getReservation().subscribe(value=> {
        this.reservas = value
        this.dataService.saveData('jsonReservation',this.reservas)
      })
    }

  }
  
  onSubmit(){
    const igualDNI = this.data.usuarios.find((usuario:any) => this.dni == usuario.dni)
    const dniAdmin = this.data.admin.find((value:any) => this.dni == value.dni)
    if(!igualDNI && !dniAdmin){
      this.errorDni = true
    }else{
      if(igualDNI){
        this.cookieService.set("dni",`${igualDNI.dni}`);
        this.router.navigate(['home'])
      }else if(dniAdmin){
        this.esAdmin = true
        this.data.admin.forEach((value:any) => {
          if(value.password == this.password){
            this.cookieService.set("dniAdmin",this.dni)
            this.router.navigate(['admin'])
          }
        })
      }else{
        this.errorPassword = true
      }
    }
  }
}

