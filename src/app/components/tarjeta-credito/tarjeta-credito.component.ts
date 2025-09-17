import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  tarjetaForm: FormGroup;
  editIndex: number | null = null;
  apiUrl = 'https://localhost:5001/api/tarjetas';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.tarjetaForm = this.fb.group({
      titular: ['', Validators.required],
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      fechadeexpiracion: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  ngOnInit(): void {
    this.cargarTarjetas();
  }

  cargarTarjetas() {
    this.http.get<any[]>(this.apiUrl)
      .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
      .subscribe(data => this.listTarjetas = data);
  }

  agregarTarjeta() {
    if (!this.tarjetaForm.valid) return;

    if (this.editIndex !== null) {
      const tarjeta = { ...this.tarjetaForm.value, id: this.listTarjetas[this.editIndex].id };
      this.http.put(`${this.apiUrl}/${tarjeta.id}`, tarjeta)
        .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
        .subscribe(() => {
          this.listTarjetas[this.editIndex!] = tarjeta;
          this.editIndex = null;
          this.tarjetaForm.reset();
        });
    } else {
      this.http.post<any>(this.apiUrl, this.tarjetaForm.value)
        .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
        .subscribe(res => {
          this.listTarjetas.push(res);
          this.tarjetaForm.reset();
        });
    }
  }

  editarTarjeta(index: number) {
    const tarjeta = this.listTarjetas[index];
    this.tarjetaForm.setValue({
      titular: tarjeta.titular,
      numero: tarjeta.numero,
      fechadeexpiracion: tarjeta.fechadeexpiracion,
      cvv: tarjeta.cvv
    });
    this.editIndex = index;
  }

  eliminarTarjeta(index: number) {
    const tarjeta = this.listTarjetas[index];
    this.http.delete(`${this.apiUrl}/${tarjeta.id}`)
      .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
      .subscribe(() => {
        this.listTarjetas.splice(index, 1);
        if (this.editIndex === index) {
          this.tarjetaForm.reset();
          this.editIndex = null;
        }
      });
  }

  mostrarFecha(tarjeta: any) {
    const valor = tarjeta.fechadeexpiracion;
    if (!valor) return '';
    const partes = valor.split('/');
    if (partes.length !== 2) return valor;
    const [mes, año] = partes;
    return `${mes}/${año}`;
  }

  autoFormatFecha(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 2) valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
    event.target.value = valor;
    this.tarjetaForm.patchValue({ fechadeexpiracion: valor }, { emitEvent: false });
  }
}
