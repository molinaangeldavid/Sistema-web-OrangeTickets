import { CUSTOM_ELEMENTS_SCHEMA, Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  habilitation: any

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
  
  constructor(
    private showComponentService: ShowComponentService,
    private dataService: DataService,
    private usuarioService: UsuarioService,
  ){
  }
  
  async ngOnInit(){
    this.dni = this.dataService.getData('dni')
    try {
      this.usuarioService.getHabilitation(this.dni).subscribe(all => {
        this.habilitation = all.habilitaciones
        if (all && all.eventos) {
          if (all.eventos.length === 2) {
            this.concerts = all.eventos; // Asigna los dos eventos a this.concerts
          } else if (all.eventos.length === 1) {
            this.concertChoice = all.eventos[0]; // Asigna el único evento a this.concertchoice
          } else {
            // Manejar el caso cuando no hay eventos
            this.concerts = [];
            this.concertChoice = null;
          }
        }
      })

    } catch (error) {
      console.log(error)
    }finally{
      this.loading = false
    }
    
    this.currentComponent! = 'scenario'
    this.subscription = this.showComponentService.componentEvent$.subscribe(name => {
      this.currentComponent = name;
    })
    this.usuario = this.dataService.getData('data')
  }
  
  habilitado(){
    return true   
  }

  changePage(value:any){
    this.currentComponent = value
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe()
  }
  
  
}
