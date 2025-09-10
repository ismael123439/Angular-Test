import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

// Bootstrap del cliente
bootstrapApplication(AppComponent, appConfig)
  .catch(err => console.error('Error al iniciar la aplicación:', err));
