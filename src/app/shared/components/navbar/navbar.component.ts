import { CommonModule } from '@angular/common';
import { Component, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ShowComponentService } from '../../../core/services/show-component.service';
import { CookieService } from 'ngx-cookie-service';

import { SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    RippleModule, 
    StyleClassModule,
    MenubarModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Input() menusecretoNada: any | undefined
  @Input() menusecreto: any| undefined
  @Input() menusecretoAdmin: any | undefined
  @Input() user: any
  
  menuItems: MenuItem[] | undefined;
  adminMenuItems: MenuItem[] | undefined;
  logoutMenuItems: MenuItem[] | undefined;
  
  constructor(
    private showService:ShowComponentService,
    private cookieService:CookieService,
    private router:Router
  ){
  }
  // }
  
  // ngOnInit(){
  // }
  
  // showReservation(){
  //   this.showService.triggerComponentEvent('scenario');
  // }
  
  // showReservated(){
  //   this.showService.triggerComponentEvent('reservated');
  // }
  
  // showCountCash(){
  //   this.showService.triggerComponentEvent('countCash'); 
  // }
  
  // showManageReserves(){
  //   this.showService.triggerComponentEvent('reserveManage');  
  // }
  
  // showManageUsers(){
  //   this.showService.triggerComponentEvent('userManage');
  // }
  
  // showEvents(){
  //   this.showService.triggerComponentEvent('events')
  // }
  
  // goOut(){
  //   if(this.menusecreto){
  //     this.cookieService.delete('token')
  //     this.cookieService.delete('dni')
  //     localStorage.removeItem('data')
  //   }else{
  //     if(this.menusecretoAdmin){
  //       this.cookieService.delete('token')
  //     }
  //   }
  //   this.router.navigate(['login'])
  // }
  
  ngOnInit() {
    this.menuItems = [
      { label: 'Sala', icon: 'pi pi-fw pi-home', command: () => this.showReservation() },
      { label: 'Detalles', icon: 'pi pi-fw pi-info-circle', command: () => this.showReservated() },
      // { label: 'Salir', icon: 'pi pi-fw pi-sign-out', command: () => this.goOut() }
    ];
    
    this.adminMenuItems = [
      { label: 'Reservas', icon: 'pi pi-fw pi-calendar', command: () => this.showManageReserves() },
      { label: 'Habilitaciones', icon: 'pi pi-fw pi-users',
        items:[
          {label: 'Usuarios', command: () => this.showManageUsers() },
          //{ label: 'Administradores', command: () => this.showManageAdmin() },
        ] 
      },
      { label: 'Eventos', icon: 'pi pi-fw pi-calendar-plus', command: () => this.showEvents() },
      { label: 'Reportes', icon: 'pi pi-fw pi-clipboard', 
        items: [
          { label: 'Caja', command: () => this.showCountCash() },
          //{ label: 'Historial',  command: () => this.showHistorialReports() },
        ]
      }, 
      // {label: 'Salir', icon: 'pi pi-fw pi-sign-out', command: () => this.goOut() }
    ];
    
    this.logoutMenuItems = [
      // { label: 'Salir', icon: 'pi pi-fw pi-sign-out', command: () => this.goOut() }
    ];
  }

  showReservation() {
    this.showService.triggerComponentEvent('scenario');
  }
  
  showReservated() {
    this.showService.triggerComponentEvent('reservated');
  }
  
  goOut() {
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
  
  showManageAdmin(){
    this.showService.triggerComponentEvent('adminManage')
  }

  showManageReserves() {
    this.showService.triggerComponentEvent('reserveManage'); 
  }
  
  showManageUsers(){
    this.showService.triggerComponentEvent('userManage')
  }
  
  showCountCash() {
    this.showService.triggerComponentEvent('countCash'); 
  }
  
  showHistorialReports(){
    this.showService.triggerComponentEvent('historialReport')
  }

  showEvents() {
    this.showService.triggerComponentEvent('events')
  }
}



