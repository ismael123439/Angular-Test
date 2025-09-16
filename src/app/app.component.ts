import { Component } from '@angular/core';
import { TarjetaCreditoComponent } from './components/tarjeta-credito/tarjeta-credito.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TarjetaCreditoComponent], // Importa el componente de tarjetas
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // ⚠️ corregido de styleUrl a styleUrls
})
export class AppComponent {
  title = 'FEtarjetadecredito';
}
