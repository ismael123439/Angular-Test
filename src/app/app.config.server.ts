import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config'; // tu configuración base

// Configuración específica para SSR
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering()
  ]
};

// Exporta la configuración combinada
export const config = mergeApplicationConfig(appConfig, serverConfig);
