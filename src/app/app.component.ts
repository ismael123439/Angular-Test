import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaCreditoComponent } from './components/tarjeta-credito/tarjeta-credito.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TarjetaCreditoComponent],
  template: `
   <app-tarjeta-credito></app-tarjeta-credito>
  `
})
export class AppComponent {
  title = 'Pagos con Tarjeta de Crédito';
}