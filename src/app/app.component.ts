import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'orangeTickets';

  constructor(private titleService: Title){
  }

  ngOnInit(){
    this.titleService.setTitle('OrangeTickets')
  }
}
