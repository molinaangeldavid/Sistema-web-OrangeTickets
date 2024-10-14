import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tipoHistoria',
  standalone: true
})
export class TipoHistoriaPipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'creaciones':
        return 'reserva creada';
      case 'eliminaciones':
        return 'reserva eliminada';
      default:
        return 'reserva confirmada';
    }
  }

}
