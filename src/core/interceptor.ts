import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable, catchError, finalize, throwError } from 'rxjs';

export function loggingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  return next(req).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse) {
        console.log(error);
      }
      return throwError(() => Error);
    }),
    finalize(() => {})
  );
}
