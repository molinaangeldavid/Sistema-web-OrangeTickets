import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.css'
})
export class NotFoundComponent {

  isDniAdmin: boolean | undefined = false
  isDni:boolean | undefined = false
  isNone: boolean | undefined = false
  constructor(private cookieService: CookieService){
  }

  ngOnInit(){
    const dniAdmin = this.cookieService.get('dniAdmin')
    const dni = this.cookieService.get('dni')
    if(dniAdmin){
      this.isDniAdmin = true
    }else{
      if(dni){
        this.isDni = true
      }else{
        this.isNone = true
      }
    }
  }

}
