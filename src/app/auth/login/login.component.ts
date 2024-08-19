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
import { DataService } from '../../core/services/data.service';
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
    private dataService: DataService,
  ){
  }
  
  ngOnInit(){    
    this.esAdmin = false
  }
  
  async onSubmit(){
    try {
      const tokenUser = await firstValueFrom(this.authService.authUser(this.dni))
      if(tokenUser){
        this.cookieService.set("dni",`${this.dni}`);
        this.cookieService.set("token",tokenUser.token);
        this.dataService.saveData("data",tokenUser.myUser)
        this.router.navigate(['estudiante'])
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

