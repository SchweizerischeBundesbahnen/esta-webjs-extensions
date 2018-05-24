import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { ClassProvider, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';

enum HttpStatusCode {
  UNAUTHORIZED = 401,
  FORBIDDEN = 403
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
      .pipe(catchError(error => this.handleErrorResponses(error)));
  }

  private handleErrorResponses(error: any): Observable<any> | Promise<any> {
    return !this.authService.authenticated()
      && error instanceof HttpErrorResponse
      && [HttpStatusCode.UNAUTHORIZED, HttpStatusCode.FORBIDDEN].indexOf(error.status) >= 0
      ? this.authService.login()
      : throwError(error);
  }
}

export const AUTH_INTERCEPTOR: ClassProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: AuthInterceptor,
  multi: true,
};
