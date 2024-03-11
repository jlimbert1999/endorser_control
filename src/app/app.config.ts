import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import localeEs from '@angular/common/locales/es-BO';

import { routes } from './app.routes';
import { loggingInterceptor } from './core/interceptor';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([loggingInterceptor])),
    provideAnimations(),
    { provide: LOCALE_ID, useValue: 'es' },
  ],
};
