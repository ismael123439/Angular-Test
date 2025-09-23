import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-tarjeta-credito',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, FormsModule],
  templateUrl: './tarjeta-credito.component.html',
  styleUrls: ['./tarjeta-credito.component.css']
})
export class TarjetaCreditoComponent implements OnInit {
  listTarjetas: any[] = [];
  listTarjetasFiltradas: any[] = []; // 👈 Nueva variable para la lista filtrada
  tarjetaForm: FormGroup;
  editIndex: number | null = null;
  apiUrl = 'http://localhost:5293/api/tarjetas';
  cvvVisibility: { [key: number]: boolean } = {};
  searchText: string = ''; // 👈 Variable para el texto de búsqueda
  mostrarLista: boolean = false;

  toggleCvvVisibility(tarjetaId: number) {
    this.cvvVisibility[tarjetaId] = !this.cvvVisibility[tarjetaId];
  }
  toggleLista() {
    this.mostrarLista = !this.mostrarLista;
  }

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
    this.cargarTarjetas();

  }

  cargarTarjetas() {
    this.http.get<any[]>(this.apiUrl)
      .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
      .subscribe(data => {
        this.listTarjetas = data;
        this.listTarjetasFiltradas = data; // 👈 Inicializa la lista filtrada con todos los datos
      });
  }

  // 👇 Nueva función para filtrar la lista
  buscarTarjetas() {
    if (this.searchText.trim() === '') {
      this.listTarjetasFiltradas = this.listTarjetas; // Muestra todas las tarjetas si el campo de búsqueda está vacío
    } else {
      this.listTarjetasFiltradas = this.listTarjetas.filter(tarjeta =>
        tarjeta.titular.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  agregarTarjeta() {
    if (!this.tarjetaForm.valid) return;

    const datosAPI = {
      Id: this.editIndex !== null ? this.listTarjetas[this.editIndex].id : 0,
      Titular: this.tarjetaForm.value.titular,
      NumeroTarjeta: this.tarjetaForm.value.numero,
      FechaVencimiento: this.convertirFechaFormatoAPI(this.tarjetaForm.value.fechadeexpiracion),
      CodigoSeguridad: this.tarjetaForm.value.cvv
    };


    if (this.editIndex !== null) {
      this.http.put(`${this.apiUrl}/${datosAPI.Id}`, datosAPI)
        .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
        .subscribe(() => {
          this.listTarjetas[this.editIndex!] = this.mapApiToLocal(datosAPI);
          this.editIndex = null;
          this.tarjetaForm.reset();
          this.buscarTarjetas(); // Actualiza la lista filtrada después de la edición
        });
    } else {
      this.http.post<any>(this.apiUrl, datosAPI)
        .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
        .subscribe(res => {
          this.listTarjetas.push(res);
          this.tarjetaForm.reset();
          this.buscarTarjetas(); // Actualiza la lista filtrada después de agregar
        });
    }
  }

  mostrarFecha(tarjeta: any): string {
    const valor = tarjeta.fechaVencimiento;

    if (!valor) return '';

    try {
      const date = new Date(valor);
      const mes = ('0' + (date.getMonth() + 1)).slice(-2);
      const anio = date.getFullYear().toString().slice(-2);
      return `${mes}/${anio}`;
    } catch (e) {
      return valor;
    }
  }

  convertirFechaFormatoAPI(fechaMMYY: string): Date {
    const [mes, anioStr] = fechaMMYY.split('/');
    const anioCompleto = parseInt(anioStr) < 50 ? 2000 + parseInt(anioStr) : 1900 + parseInt(anioStr);
    return new Date(anioCompleto, parseInt(mes) - 1, 1);
  }

  mapApiToLocal(apiData: any): any {
    return {
      id: apiData.Id,
      titular: apiData.Titular,
      numeroTarjeta: apiData.NumeroTarjeta,
      fechaVencimiento: apiData.FechaVencimiento,
      codigoSeguridad: apiData.CodigoSeguridad
    };
  }

  editarTarjeta(index: number) {
    const tarjeta = this.listTarjetasFiltradas[index]; // 👈 Usa la lista filtrada para el índice

    this.tarjetaForm.patchValue({
      titular: tarjeta.titular,
      numero: tarjeta.numeroTarjeta,
      fechadeexpiracion: this.formatearFechaParaFormulario(tarjeta.fechaVencimiento),
      cvv: tarjeta.codigoSeguridad
    });

    this.editIndex = this.listTarjetas.findIndex(t => t.id === tarjeta.id); // 👈 Encuentra el índice en la lista original
  }

  formatearFechaParaFormulario(fechaISO: string): string {
    const date = new Date(fechaISO);
    const mes = ('0' + (date.getMonth() + 1)).slice(-2);
    const anio = date.getFullYear().toString().slice(-2);
    return `${mes}/${anio}`;
  }

  eliminarTarjeta(index: number) {
    const tarjeta = this.listTarjetasFiltradas[index]; // 👈 Usa la lista filtrada para el índice
    this.http.delete(`${this.apiUrl}/${tarjeta.id}`)
      .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
      .subscribe(() => {
        // Elimina de ambas listas
        const indexOriginal = this.listTarjetas.findIndex(t => t.id === tarjeta.id);
        if (indexOriginal !== -1) {
          this.listTarjetas.splice(indexOriginal, 1);
        }
        this.listTarjetasFiltradas.splice(index, 1);

        if (this.editIndex === index) {
          this.tarjetaForm.reset();
          this.editIndex = null;
        }
      });
  }



  autoFormatFecha(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 2) valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
    event.target.value = valor;
    this.tarjetaForm.patchValue({ fechadeexpiracion: valor }, { emitEvent: false });
  }
}