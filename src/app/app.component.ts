import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TarjetaCreditoComponent } from './components/tarjeta-credito/tarjeta-credito.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, TarjetaCreditoComponent],
  template: `
    <div class="container mt-4">
      <h1>Gestión de Tarjetas de Crédito</h1>
      <app-tarjeta-credito></app-tarjeta-credito>
    </div>
  `
})
export class AppComponent { }
