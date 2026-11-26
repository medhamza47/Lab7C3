import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (request, next) => next(request).pipe(
  catchError((error: HttpErrorResponse) => {
    const message = error.status === 0 ? 'Serveur indisponible.'
      : error.status === 404 ? 'Étudiant introuvable.'
      : error.status === 400 ? 'Les données envoyées sont invalides.'
      : `La requête a échoué (HTTP ${error.status}).`;
    return throwError(() => new Error(message));
  }),
);
