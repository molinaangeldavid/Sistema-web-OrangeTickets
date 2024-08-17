import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataService } from '../../../core/services/data.service';
import { CookieService } from 'ngx-cookie-service';
import { ReservationService } from '../../../core/services/reservation.service';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import FileSaver, { saveAs } from 'file-saver';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from 'pdfmake/build/vfs_fonts';

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

  totalReservado: number = 0;

  dialog: boolean = false

  info: any

  hasReserves: boolean = true

  constructor(
    private cookieService: CookieService,
    private reservationService: ReservationService,
    private dataService: DataService
  ) {}
  
  ngOnInit() {
    
    this.dni = this.cookieService.get('dni')

    this.cols = [
      { field: 'fila', header: 'Nº Fila' },
      { field: 'butaca', header: 'Nº Butaca' },
      { field: 'fecha', header: 'Fecha reserva' },
      { field: 'hora', header: 'Hora reserva' },
      { field: 'estado', header: 'Estado' }
    ];

    // this.reserves = this.dataService.getData('jsonReservation')[this.dni]
    this.reservationService.getReservation(this.dni).subscribe(value => {
      this.reserves = value
      if(value.length == 0){
        this.hasReserves = false
      }
      this.calcularTotalReservado()
    })
    this.info = this.dataService.getData('data')
  }

  calcularTotalReservado() {
    this.totalReservado = this.reserves
      .filter((reserva:any) => reserva.estado === 'reservado')
      .reduce((total:any, reserva:any) => total + this.escenario.valor, 0);
  }

  // downloadInformation(){

  // }

  convertToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }

  async downloadReserves(){
    this.dialog = true
    const doc = new jsPDF({
      unit: 'cm',
      format: 'a4'
    });
    const margin = 2.5;
    let currentHeight = margin;

    const addImageToPDF = async (element: HTMLElement | null, pdf: jsPDF) => {
      if (element) {
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth() - margin * 2;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // Check if the image will overflow the page height
        if (currentHeight + imgHeight > pdf.internal.pageSize.getHeight() - margin) {
          pdf.addPage();
          currentHeight = margin; // Reset currentHeight for the new page
        }

        pdf.addImage(imgData, 'PNG', margin, currentHeight, imgWidth, imgHeight);
        currentHeight += imgHeight; // Update the currentHeight
      } else {
        console.error('Element not found');
      }
    };

    const div1 = document.getElementById('perfil')
    await addImageToPDF(div1,doc)
    
    const div2 = document.getElementById('concert')
    await addImageToPDF(div2,doc)
  
    const div3 = document.getElementById('card')
    await addImageToPDF(div3,doc)
    
    const div4 = document.getElementById('todo')
    await addImageToPDF(div4,doc)
    
    const pdfOutput = doc.output('blob')
    saveAs(pdfOutput, `Reservas de ${this.dni}.pdf`)
    
  }

  openDialog(){
    this.dialog = true
  }
  
}
