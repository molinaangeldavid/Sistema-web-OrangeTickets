import { Pipe, PipeTransform } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { AdminService } from '../../core/services/admin.service';
import { catchError, map, of } from 'rxjs';

@Pipe({
  name: 'admin',
  standalone: true
})
export class AdminPipe implements PipeTransform {

  constructor(private adminService: AdminService){
  }
  transform(dni: any, ...args: any[]): any {
    return this.adminService.getAdminByDni(dni).pipe(
      map(admin => {
        if(admin[0] && admin[0].nombre && admin[0].apellido){
          return `${admin[0].nombre} ${admin[0].apellido}`
        }else{
          return 'Admin no encontrado'
        }
      }),
      catchError(err => {
        console.log('error fetching admin: ', err)
        return of('Error al obtener datos')
      })
    )
  }

}
