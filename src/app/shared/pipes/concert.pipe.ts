import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'concert',
  standalone: true
})
export class ConcertPipe implements PipeTransform {

  transform(value: any,): any {
    
  }

}
