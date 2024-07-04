import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { ShowComponentService } from '../../../core/services/show-component.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  
  @Input() menusecreto: any|undefined
  @Input() menusecretoAdmin: any | undefined
  
  constructor(private showService:ShowComponentService,
    private cookieService:CookieService,
    private router:Router
  ){
    
  }
  
  ngOnInit(){
    
  }
  
  showReservation(){
    this.showService.triggerComponentEvent('scenario');
  }
  
  showReservated(){
    this.showService.triggerComponentEvent('reservated');
  }
  
  showCountCash(){
    this.showService.triggerComponentEvent('countCash'); 
  }
  
  showManageReserves(){
    this.showService.triggerComponentEvent('reserveManage');  
  }
  
  showManageUsers(){
    this.showService.triggerComponentEvent('userManage');
  }
  
  goOut(){
    if(this.menusecreto){
      this.cookieService.delete('dni')
    }else{
      if(this.menusecretoAdmin){
        this.cookieService.delete('dniAdmin')
      }
    }
    this.router.navigate(['login'])
  }
  
}
