import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Agregamos CommonModule

@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [CommonModule], // Necesario para que las directivas estructurales funcionen
  templateUrl: './components/tarjeta-credito/tarjeta-credito.component.html',
  styleUrl: './components/tarjeta-credito/tarjeta-credito.component.css'
})
export class TarjetaCreditoComponent implements OnInit {

  // La lista de tarjetas ahora vive en este componente
  listTarjetas: any[] = [
    { titular: "Franco Mastantuono", numero: "1234567890123456", fechadeexpiracion: "9/12", cvv: "123" },
    { titular: "Sebastian Driussi", numero: "4983844884474847", fechadeexpiracion: "9/12", cvv: "918" }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}