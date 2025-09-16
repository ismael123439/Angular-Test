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
  editIndex: number | null = null; // 🔹 Para saber si estamos editando

  constructor(private fb: FormBuilder) {
    this.tarjetaForm = this.fb.group({
      titular: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fechadeexpiracion: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  // 🔹 Agregar o guardar cambios
  agregarTarjeta() {
    if (this.tarjetaForm.valid) {
      if (this.editIndex !== null) {
        this.listTarjetas[this.editIndex] = { ...this.tarjetaForm.value };
        this.editIndex = null;
      } else {
        this.listTarjetas.push({ ...this.tarjetaForm.value });
      }
      this.tarjetaForm.reset();
    }
  }

  // 🔹 Editar tarjeta
  editarTarjeta(index: number) {
    const tarjeta = this.listTarjetas[index];
    this.tarjetaForm.setValue({ ...tarjeta });
    this.editIndex = index;
  }

  // 🔹 Eliminar tarjeta
  eliminarTarjeta(index: number) {
    this.listTarjetas.splice(index, 1);
    if (this.editIndex === index) {
      this.tarjetaForm.reset();
      this.editIndex = null;
    }
  }

  // 🔹 Formatear fecha MM/AA
// Devuelve la fecha en formato MM/AA para mostrar en la tabla
mostrarFecha(tarjeta: any) {
  const valor = tarjeta.fechadeexpiracion;
  if (!valor) return '';
  
  // Espera MM/AA
  const partes = valor.split('/');
  if (partes.length !== 2) return valor; // si no está en MM/AA, lo devuelve crudo

  const [mes, año] = partes;
  return `${mes}/${año}`;
}


autoFormatFecha(event: any) {
  let valor = event.target.value.replace(/\D/g, ''); // saca todo lo que no sea número
  if (valor.length > 2) valor = valor.slice(0,2) + '/' + valor.slice(2,4);
  event.target.value = valor;
  this.tarjetaForm.patchValue({ fechadeexpiracion: valor }, { emitEvent: false });
}

}


