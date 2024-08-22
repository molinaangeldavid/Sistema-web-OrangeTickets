import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ButtonModule } from 'primeng/button';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent,
    ButtonModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  
  dni: any
  password: any
  
  errorDni: any  = false
  errorPassword: any = false

  errorMessage: any
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
    private router: Router,
    private dataService: DataService
  ){
  }
  
  ngOnInit(){
    
  }

  async onSubmit(){
    this.cookieService.deleteAll()
    try {
      const tokenAdmin = await firstValueFrom(this.authService.authAdmin(this.dni,this.password))
      if(tokenAdmin){
        this.cookieService.set("dniAdmin",this.dni)
        this.cookieService.set("token",tokenAdmin.token)
        this.dataService.saveData('data',tokenAdmin.myUser) 

        this.router.navigate(['admin'])
      }
    }
    catch (error:any) {
      if (error.status === 401) {
        this.errorMessage = error.error.message;
        if (this.errorMessage.includes('Dni')) {
          this.errorDni = true;
        } else if (this.errorMessage.includes('Contraseña')) {
          this.errorPassword = true;
        }
      } else {
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
  }
  }
}


