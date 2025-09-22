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
  apiUrl = 'http://localhost:5293/api/tarjetas';
  cvvVisibility: { [key: number]: boolean } = {};

  toggleCvvVisibility(tarjetaId: number) {
    // Si la tarjeta ya tiene un estado de visibilidad, lo invierte. 
    // Si no lo tiene, lo establece en true (visible).
    this.cvvVisibility[tarjetaId] = !this.cvvVisibility[tarjetaId];
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.tarjetaForm = this.fb.group({
      titular: ['', Validators.required],
      // El nombre del control del formulario es 'numero'
      numero: ['', [Validators.required, Validators.pattern(/^\d{16}$/)]],
      // El nombre del control del formulario es 'fechadeexpiracion'
      fechadeexpiracion: ['', [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)]],
      // El nombre del control del formulario es 'cvv'
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

    // 💡 CORRECCIÓN 1: Crear un objeto que coincida con el backend antes de POST/PUT
    // Esto mapea los nombres del formulario (ej: 'numero') a los nombres del API (ej: 'NumeroTarjeta')
    const datosAPI = {
      Id: this.editIndex !== null ? this.listTarjetas[this.editIndex].id : 0, // Incluir ID si es edición
      Titular: this.tarjetaForm.value.titular,
      NumeroTarjeta: this.tarjetaForm.value.numero,
      // Convertir 'MM/AA' a un formato que el backend acepte (ej: '20YY-MM-01')
      // Se asume que el backend ASP.NET Core puede parsear una fecha válida. 
      FechaVencimiento: this.convertirFechaFormatoAPI(this.tarjetaForm.value.fechadeexpiracion), 
      CodigoSeguridad: this.tarjetaForm.value.cvv
    };


    if (this.editIndex !== null) {
      this.http.put(`${this.apiUrl}/${datosAPI.Id}`, datosAPI)
        .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
        .subscribe(() => {
          // Si el PUT es exitoso, actualiza la lista local con el objeto que enviaste (datosAPI)
          // ASP.NET Core devuelve los nombres en camelCase, por eso los ajustamos aquí para la lista
          this.listTarjetas[this.editIndex!] = this.mapApiToLocal(datosAPI);
          this.editIndex = null;
          this.tarjetaForm.reset();
        });
    } else {
      this.http.post<any>(this.apiUrl, datosAPI)
        .pipe(catchError(err => { console.error(err); return throwError(() => err); }))
        .subscribe(res => {
          this.listTarjetas.push(res);
          this.tarjetaForm.reset();
        });
    }
  }

  // Se mantiene esta función, pero se recomienda usar el DatePipe en el HTML
  mostrarFecha(tarjeta: any): string {
    // 💡 CORRECCIÓN 3: Usar 'fechaVencimiento' que viene del API
    const valor = tarjeta.fechaVencimiento;
    
    if (!valor) return '';
    
    // Si la fecha es un objeto Date o una cadena de fecha completa (ej: "2025-01-01T00:00:00")
    try {
        const date = new Date(valor);
        const mes = ('0' + (date.getMonth() + 1)).slice(-2);
        const anio = date.getFullYear().toString().slice(-2);
        return `${mes}/${anio}`;
    } catch (e) {
        // En caso de error, devuelve el valor tal cual
        return valor;
    }
  }
  
  // 💡 FUNCIÓN DE AYUDA: Convierte el formato 'MM/AA' a una fecha completa para la API
  convertirFechaFormatoAPI(fechaMMYY: string): Date {
      const [mes, anioStr] = fechaMMYY.split('/');
      // Asume que si el año es < 50, es 20xx, sino es 19xx. 
      const anioCompleto = parseInt(anioStr) < 50 ? 2000 + parseInt(anioStr) : 1900 + parseInt(anioStr);
      
      // Crea un objeto Date. El día es el 1 para evitar problemas.
      // ASP.NET Core lo recibirá como ISO 8601 string.
      return new Date(anioCompleto, parseInt(mes) - 1, 1); 
  }

  // 💡 FUNCIÓN DE AYUDA: Mapea de formato API (PascalCase) a formato de lista local (camelCase)
  // Útil si la lista no se recarga después de un PUT y se actualiza localmente.
  mapApiToLocal(apiData: any): any {
      return {
          id: apiData.Id,
          titular: apiData.Titular,
          numeroTarjeta: apiData.NumeroTarjeta,
          fechaVencimiento: apiData.FechaVencimiento,
          codigoSeguridad: apiData.CodigoSeguridad
      };
  }

  // 💡 CORRECCIÓN 2: Asegurar que los nombres de las propiedades del API sean los correctos.
  editarTarjeta(index: number) {
    const tarjeta = this.listTarjetas[index];
    
    this.tarjetaForm.patchValue({
      titular: tarjeta.titular, 
      // El API devuelve 'numeroTarjeta' (en camelCase), que ahora se mapea al control 'numero'
      numero: tarjeta.numeroTarjeta, 
      // El API devuelve 'fechaVencimiento' (en camelCase), que ahora se mapea al control 'fechadeexpiracion'
      fechadeexpiracion: this.formatearFechaParaFormulario(tarjeta.fechaVencimiento), 
      // El API devuelve 'codigoSeguridad' (en camelCase), que ahora se mapea al control 'cvv'
      cvv: tarjeta.codigoSeguridad
    });
    
    this.editIndex = index;
  }
  
  // 💡 FUNCIÓN DE AYUDA: Formatea la fecha ISO del API (ej: "2025-01-01T00:00:00") a "MM/YY" para el input
  formatearFechaParaFormulario(fechaISO: string): string {
      const date = new Date(fechaISO);
      const mes = ('0' + (date.getMonth() + 1)).slice(-2);
      const anio = date.getFullYear().toString().slice(-2);
      return `${mes}/${anio}`;
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

  autoFormatFecha(event: any) {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length > 2) valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
    event.target.value = valor;
    this.tarjetaForm.patchValue({ fechadeexpiracion: valor }, { emitEvent: false });
  }
}

