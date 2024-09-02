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
  adminSuper: boolean =  false
  superAdminMenuItems: any[] | undefined;
  operadorMenuItems: any[] | undefined

  constructor(
    private showService:ShowComponentService,
    private cookieService:CookieService,
    private router:Router
  ){
  }
  
  private readonly ADMIN_DNI1 = 37760822
  private readonly ADMIN_DNI2 = 35902759

  ngOnInit() {
    this.menuItems = [
      { label: 'Sala', icon: 'pi pi-fw pi-home', command: () => this.showReservation() },
      { label: 'Detalles', icon: 'pi pi-fw pi-info-circle', command: () => this.showReservated() },
    ];

    this.superAdminMenuItems = [
      { label: 'Reservas', icon: 'pi pi-fw pi-calendar', command: () => this.showManageReserves() },
      { label: 'Habilitaciones', icon: 'pi pi-fw pi-users',
        items:[
          {label: 'Usuarios', command: () => this.showManageUsers() },
          { label: 'Administradores', command: () => this.showManageAdmin() },
        ],
      },
      { label: 'Eventos', icon: 'pi pi-fw pi-calendar-plus', command: () => this.showEvents() },
      { label: 'Reportes', icon: 'pi pi-fw pi-clipboard', 
        items: [
          { label: 'Caja', command: () => this.showCountCash() },
          { label: 'Historial',  command: () => this.showHistorialReports() },
        ]
      },
    ];

    this.adminMenuItems = [
      { label: 'Reservas', icon: 'pi pi-fw pi-calendar', command: () => this.showManageReserves() },
      { label: 'Habilitaciones', icon: 'pi pi-fw pi-users',
        items:[
          {label: 'Usuarios', command: () => this.showManageUsers() },
        ],
      },
      { label: 'Eventos', icon: 'pi pi-fw pi-calendar-plus', command: () => this.showEvents() },
      { label: 'Reportes', icon: 'pi pi-fw pi-clipboard', 
        items: [
          { label: 'Caja', command: () => this.showCountCash() },
          { label: 'Historial',  command: () => this.showHistorialReports() },
        ]
      },
    ];

    this.operadorMenuItems = [
      { label: 'Reservas', icon: 'pi pi-fw pi-calendar', command: () => this.showManageReserves() },
    ];

    if(this.menusecretoAdmin){
      switch (this.user.role) {
        case 'superadmin':
          this.menusecretoAdmin = true;
          this.adminMenuItems = this.superAdminMenuItems;
          break;
        case 'admin':
          this.menusecretoAdmin = true;
          this.adminMenuItems = this.adminMenuItems;
          break;
        case 'operador':
          this.menusecretoAdmin = true;
          this.adminMenuItems = this.operadorMenuItems;
          break;
      }
    }
  
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



