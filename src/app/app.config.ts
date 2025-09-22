import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes'; // Tus rutas definidas en app.routes.ts

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(), // Habilita rehidratación en cliente
    provideHttpClient(withFetch()) // Habilita fetch para SSR
  ]
};