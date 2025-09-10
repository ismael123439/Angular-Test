import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';

// Función para bootstrap del servidor
const bootstrap = () => bootstrapApplication(AppComponent, config);

// Exportamos la función para que el server la use
export default bootstrap;
