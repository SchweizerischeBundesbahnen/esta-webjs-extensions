import {
    HTTP_INTERCEPTORS,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {ClassProvider, Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {catchError} from 'rxjs/operators';

import {AuthService} from './auth.service';

export enum HTTP_STATUS_CODE {
    UNAUTHORIZED = 401,
    FORBIDDEN = 403
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!this.authService.authenticated) {
            return next.handle(req);
        }
        return next.handle(req).pipe(catchError((error: any) => this.handleErrorResponses(error)));
    }

    private handleErrorResponses(error: any): Observable<any> {
        if (error instanceof HttpErrorResponse) {
            if (error.status === HTTP_STATUS_CODE.UNAUTHORIZED || error.status === HTTP_STATUS_CODE.FORBIDDEN) {
                this.authService.login();
            }
        }
        return ErrorObservable.create(error);
    }
}

export const AUTH_INTERCEPTOR: ClassProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};
