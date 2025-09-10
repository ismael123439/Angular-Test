import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent {
  listTarjetas = [
    { titular: 'Franco Mastantuono', numero: '1234567890123456', fechadeexpiracion: '09/12', cvv: '123' },
    { titular: 'Sebastian Driussi', numero: '4983844884474847', fechadeexpiracion: '09/12', cvv: '918' }
  ];

  tarjetaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.tarjetaForm = this.fb.group({
      titular: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fechadeexpiracion: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  agregarTarjeta() {
    if (this.tarjetaForm.valid) {
      this.listTarjetas.push({ ...this.tarjetaForm.value });
      this.tarjetaForm.reset();
    }
  }

  autoFormatFecha(event: any) {
    let valor = event.target.value.replace(/\D/g, ''); // eliminamos todo lo que no sea número
    if (valor.length > 2) {
      valor = valor.slice(0,2) + '/' + valor.slice(2,4);
    }
    event.target.value = valor;
    this.tarjetaForm.patchValue({ fechadeexpiracion: valor }, { emitEvent: false });
  }
}
