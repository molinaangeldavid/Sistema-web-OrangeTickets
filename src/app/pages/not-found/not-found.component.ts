import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../core/services/data.service';

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

  constructor(private dataService:DataService){
  }

  ngOnInit(){
    const dniAdmin = this.dataService.getData('dniAdmin')
    const dni = this.dataService.getData('dni')
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
