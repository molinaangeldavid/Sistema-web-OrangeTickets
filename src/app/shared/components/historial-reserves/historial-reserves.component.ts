import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-historial-reserves',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './historial-reserves.component.html',
  styleUrl: './historial-reserves.component.css'
})
export class HistorialReservesComponent {

  usuario: any 

}
