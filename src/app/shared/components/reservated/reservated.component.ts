import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService } from '../../../core/services/data.service';
import { ReservationService } from '../../../core/services/reservation.service';
import { ConcertService } from '../../../core/services/concert.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts'
import {font} from '../../../../assets/font'
pdfMake.vfs = pdfFonts.pdfMake.vfs;


interface Column {
  field: string;
  header: string;
}

@Component({
  selector: 'app-reservated',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    DialogModule
  ],
  templateUrl: './reservated.component.html',
  styleUrl: './reservated.component.css'
})
export class ReservatedComponent {
  reserves: any
  
  cols!: Column[];
  
  dni: any | undefined
  
  @Input() escenario: any
  @Input() usuario:any
  
  totalReservado: number = 0;
  
  dialog: boolean = false
  
  info: any
  
  hasReserves: boolean = true
  
  allEvents: any
  
  constructor(
    private reservationService: ReservationService,
    private dataService: DataService,
    private concertService: ConcertService
  ) {}
  
  ngOnInit() {
    
    this.dni = this.dataService.getData('dni')
    
    this.cols = [
      { field: 'evento_id', header: 'Concert' },
      { field: 'fila', header: 'Nº Fila' },
      { field: 'butaca', header: 'Nº Butaca' },
      { field: 'fecha', header: 'Fecha reserva' },
      { field: 'hora', header: 'Hora reserva' },
      { field: 'estado', header: 'Estado' }
    ];
    
    this.concertService.getEventsUser().subscribe(events => {
      this.allEvents = events
    })
    
    this.reservationService.getReservation(this.dni).subscribe(value => {
      this.reserves = value
      if(value.length == 0){
        this.hasReserves = false
      }
      this.calcularTotalReservado()
    })
    this.info = this.dataService.getData('data')
  }
  
  getName(id:any){
    const evento = this.allEvents.find((e:any) => e.id == id)
    return `${evento.nombre}`
  }
  
  isPendingPayment(reserva: any): boolean {
    const paymentDeadline = new Date(); // Ajusta esta fecha según tu lógica
    const reserveDate = new Date(reserva.fechaDni); // Asegúrate de que `fechaDni` esté en formato de fecha
    
    // Si la reserva está en estado 'reservado' y la fecha actual es menor a la fecha límite de pago
    return reserva.estado === 'reservado' && reserveDate <= paymentDeadline;
  }
  
  calcularTotalReservado() {
    this.totalReservado = this.reserves
    .filter((reserva:any) => reserva.estado === 'reservado')
    .reduce((total:any) => total + (this.escenario.valor || 0), 0);
  }
  
  isDisabledSeat(reserva: any): boolean {
    return reserva.tipo == 'd'; 
  }

  getDataUrlFromImage(url: string): Promise<string>{
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL());
        } else {
          reject('Error creating canvas context');
        }
      };
      img.onerror = () => reject('Error loading image');
      img.src = url;
    });
  };
  
  fechaFormatted(date:Date){
    const fechaUTC = new Date(date); // Tu fecha en formato UTC
    
    const opciones: Intl.DateTimeFormatOptions = {
      weekday: 'long',  // nombre del día (domingo)
      year: 'numeric',  // año (2024)
      month: 'long',    // nombre del mes (noviembre)
      day: 'numeric'    // número del día (29)
    };
    
    const fechaFormateada = fechaUTC.toLocaleDateString('es-ES', opciones);
    return fechaFormateada // "viernes, 29 de noviembre de 2024"
  }
  
  formatFechaUTC(fechaUTC: any): string {
    if (!fechaUTC || typeof fechaUTC !== 'string') {
      throw new Error('Fecha UTC inválida');
    }
    const fecha = new Date(fechaUTC);
    // Verifica si la fecha es válida
    if (isNaN(fecha.getTime())) {
      throw new Error('Fecha UTC no válida');
    }

    fecha.setUTCHours(fecha.getUTCHours() - 3);
    
    const year = fecha.getUTCFullYear();
    const month = String(fecha.getUTCMonth() + 1).padStart(2, '0'); // Mes empieza en 0
    const day = String(fecha.getUTCDate()).padStart(2, '0');
    const hours = String(fecha.getUTCHours()).padStart(2, '0');
    const minutes = String(fecha.getUTCMinutes()).padStart(2, '0');
  
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  }

  async generarPDF() {
    const colegioImagen = await this.getDataUrlFromImage('../../../../assets/oie_transparent.png') 
    const lugar = 'Paseo La Plaza // Sala Pablo Picasso '
    const detallesEvento = { 
      nombre: this.escenario.nombre,
      fecha: this.fechaFormatted(this.escenario.fecha),
      hora: this.escenario.hora,
      lugar: lugar
    }
    const vencimientoReserva =  'Las reservas deben abonarse dentro de los 2 días hábiles siguientes. Luego las reservas seran canceladas caso que no se confirmen.';
    const condiciones = 'Las entradas podrán abonarse sólo en efectivo en Administración (Av. San Martin 1663) en el horario de 8 a 14hs.';
    const datos = {
      email: 'concert2024@orangeinternational.edu.ar',
      telefono: '35306532',
      direccion: 'Av Gral. San Martin 1663, Ramos Mejia'
    }
    pdfMake.vfs = {
      ...pdfFonts.pdfMake.vfs,
      "monotype-old-english.ttf":font,
    }
    pdfMake.fonts = {
      CustomFont: {
        normal: "monotype-old-english.ttf"
      },
      Roboto: {
        normal: 'Roboto-Regular.ttf',
        bold: 'Roboto-Medium.ttf',
        italics: 'Roboto-Italic.ttf',
        bolditalics: 'Roboto-MediumItalic.ttf',
      },
    };
    const docDefinition:any = {
      content: [
        {
          columns: [
            {
              image: colegioImagen,
              width: 100
            },
            {
              stack: [
                {
                  text: 'Orange\n',
                  font: 'CustomFont',
                  fontSize:20,
                  style: 'header',
                  color: '#072475'
                },
                {
                  text: 'Day School\n',
                  font: 'Roboto',
                  fontSize:16,
                  style: 'header',
                  color: '#072475'
                }
              ],
              alignment: 'right',
              margin: [10, 0, 0, 0], // margen entre la imagen y el texto
            }
          ]
        },
        {
          text: 'Detalles del Evento',
          style: 'sectionTitle'
        },
        {
          text: `Nombre: ${detallesEvento.nombre} - ${detallesEvento.fecha} - ${detallesEvento.hora}\n ${detallesEvento.lugar}\n`,
          style: 'sectionText'
        },
        {
          text: 'Vencimiento de las Reservas',
          style: 'sectionTitle'
        },
        {
          text: `${vencimientoReserva}\n`,
          style: 'sectionText'
        },
        {
          text: 'Ubicaciones Reservadas',
          style: 'sectionTitle'
        },
        {
          table: {
            headerRows: 1,
            widths: [100, 100, 100, '*'],
            body: [
              ['Fila', 'Asiento', 'Fecha de Reserva','Estado'],
              ...this.reserves.map((u: any) => [u.fila, u.butaca, this.formatFechaUTC(u.fechaDni), u.estado])
            ]
          },
        },
        {
          text: `Importe a Pagar`,
          style: 'sectionTitle'
        },
        {
          text: `$${this.totalReservado}\n`,
          style: 'sectionText',
          
        },
        {
          text: `Condiciones Generales`,
          style: 'sectionTitle'
        },
        {
          text: `${condiciones}\n\n`,
          style: 'sectionText'
        },
        {
          text: `Nombre: ${this.usuario.nombre} ${this.usuario.apellido}\nDNI: ${this.usuario.dni}\n\n`,
          style: 'sectionText'
        },
        
      ],
      footer: function(currentPage:any, pageCount:any) {
        return [
          {
            canvas: [
              {
                type: 'line',
                x1: 0,
                y1: 0,
                x2: 515, // Ajusta el valor según el ancho deseado
                y2: 0,
                lineWidth: 1
              },
            ],
            alignment: 'center',
            margin: [0,0,0,10]
          },
          {
            text: `Email: ${datos.email} - Teléfono: ${datos.telefono}\nDirección: ${datos.direccion}`,
            style: 'footer',
            alignment: 'center',
          }
        ];
      },
      styles: {
        sectionTitle: {
          fontSize: 16,
          bold: true,
          margin: [0, 15, 0, 5]
        },
        sectionText: {
          fontSize: 12,
          margin: [0, 0, 0, 10]
        },
        footer: {
          fontSize: 10,
          italics: true,
          margin: [0,0]
        }
      },
      pageMargins: [40, 60, 40, 40]
    };
    
    pdfMake.createPdf(docDefinition).download('reserva_concierto.pdf');
  }
  openDialog(){
    this.dialog = true
  }
  
}
