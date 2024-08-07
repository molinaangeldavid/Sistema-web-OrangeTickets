import { CUSTOM_ELEMENTS_SCHEMA, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ReservatedComponent } from "../../shared/components/reservated/reservated.component";
import { ScenarioComponent } from "../../shared/components/scenario/scenario.component";
import { NavbarComponent } from "../../shared/components/navbar/navbar.component";
import { FooterComponent } from "../../shared/components/footer/footer.component";

import { Subscription } from 'rxjs';

import { ShowComponentService } from '../../core/services/show-component.service';
import { DataService } from '../../core/services/data.service';
import { UsuarioService } from '../../core/services/usuario.service';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CookieService } from 'ngx-cookie-service';
import { ElementRefService } from '../../core/services/element-ref.service';


@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  imports: [
    ReservatedComponent,
    ScenarioComponent,
    NavbarComponent,
    FooterComponent,
    CommonModule,
    FormsModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    ProgressSpinnerModule
  ],
  schemas:[
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class HomeComponent implements OnInit,OnDestroy {
  
  loading: any = true

  private subscription: Subscription | undefined;
  
  currentComponent: string | undefined 
  
  dni: any | undefined
  // Concierto elegido por el usuario
  concertChoice: any | undefined
  //
  // Todos los conciertos
  concerts: any | undefined
  //Concerts de localStorage
  allConcerts: any | undefined
  //La data de los usuarios
  dataUsers: any[] | undefined
  
  usuario:any={}
  
  usuarios: any
  
  admin: boolean = false
  
  menusecreto:any
  menusecretonada: any

  @ViewChild('perfil') perfil!: ElementRef;
  @ViewChild('concert') concert!: ElementRef;

  constructor(
    private showComponentService: ShowComponentService,
    private dataService: DataService,
    private usuarioService: UsuarioService,
    private cookieService: CookieService,
    private elementRefService: ElementRefService
  ){
  }

  async ngOnInit(){
    const token = this.cookieService.get('token')
    this.usuarioService.getHabilitation().subscribe(event => {
      this.concertChoice = event.evento
      this.loading = false
    })

    this.currentComponent! = 'scenario'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })
    this.usuario = this.dataService.getData('data')
  }
  
  ngAfterViewInit(){
    this.elementRefService.setElement('perfil',this.perfil.nativeElement)
    this.elementRefService.setElement('concert',this.concert.nativeElement)
  }

  changePage(value:any){
    this.currentComponent = value
  }
  // Elige todos los conciertos que tiene el dni - deshabilitado por el momento
  // private _searchScenario(){
  //   const concerts:any = []
  //   for(let i = 0; i < this.usuario.habilitaciones.length;i++){
  //     const c = this.usuario.habilitaciones[i]
  //     concerts.push(this.allConcerts[c])
  //   }
  //   return concerts
  // }
  
  
  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
  
  
}
