import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, throwError } from 'rxjs';
import { AlertService, ApparenceService } from '../presentation/services';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const apparecenService = inject(ApparenceService);
  const alertService = inject(AlertService);
  apparecenService.showLoader();
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        handleHttpErrors(error, alertService);
      }
      console.error(error);
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

    default:
      service.Alert({
        icon: 'info',
        title: 'Error desconocido',
        text: 'Se ha producido un error desconocido.',
      });
      break;
  }
}
