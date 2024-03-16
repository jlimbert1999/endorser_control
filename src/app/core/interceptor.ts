import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import {
  AlertService,
  ApparenceService,
  AuthService,
} from '../presentation/services';
import { Router } from '@angular/router';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const apparecenService = inject(ApparenceService);
  const alertService = inject(AlertService);
  const autService = inject(AuthService);
  const router = inject(Router);
  const reqWithHeader = req.clone({
    headers: req.headers.append(
      'Authorization',
      `Bearer ${localStorage.getItem('token') || ''}`
    ),
  });
  apparecenService.showLoader();
  return next(reqWithHeader).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        if (error.status === 401) {
          autService.logout();
          router.navigate(['/login']);
        } else {
          handleHttpErrors(error, alertService);
        }
      }
      return throwError(() => Error);
    }),
    finalize(() => {
      apparecenService.hideLoader();
    })
  );
}
function handleHttpErrors(error: HttpErrorResponse, service: AlertService) {
  switch (error.status) {
    case 400:
      service.Alert({
        icon: 'warning',
        title: 'Solicitud incorrecta.',
        text: error.error.message,
      });
      break;
    case 500:
      service.Alert({
        icon: 'error',
        title: 'Error en el servidor',
        text: 'Se ha producido un error en el servidor.',
      });
      break;
    case 404:
      service.Alert({
        icon: 'info',
        title: 'El recurso solicitado no existe',
        text: `${error.url} no econtrado`,
      });
      break;

    default:
      service.Alert({
        icon: 'info',
        title: 'Error desconocido',
        text: 'Se ha producido un error desconocido.',
      });
      break;
  }
}
