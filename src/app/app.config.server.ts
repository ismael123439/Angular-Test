import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config'; // Configuración base de tu app

// Configuración específica para SSR (Server Side Rendering)
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Exporta la configuración combinada
export const config = mergeApplicationConfig(appConfig, serverConfig);
