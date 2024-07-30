import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ShowComponentService } from '../../../core/services/show-component.service';
import { CookieService } from 'ngx-cookie-service';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { Sidebar } from 'primeng/sidebar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    RippleModule, 
    StyleClassModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() menusecretoNada: any | undefined
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

  showEvents(){
    this.showService.triggerComponentEvent('events')
  }
  
  goOut(){
    if(this.menusecreto){
      this.cookieService.delete('token')
      this.cookieService.delete('dni')
      localStorage.removeItem('data')
    }else{
      if(this.menusecretoAdmin){
        this.cookieService.delete('token')
      }
    }
    this.router.navigate(['login'])
  }
  
}
