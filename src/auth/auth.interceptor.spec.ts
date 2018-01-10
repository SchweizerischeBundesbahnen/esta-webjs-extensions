/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Unit-test für den Authentifiezierungs-Interceptor
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 4.4.4
 * @since 22.11.2017, 2017.
 */
import {HttpErrorResponse, HttpHandler, HttpRequest} from '@angular/common/http';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {AuthInterceptor, HTTP_STATUS_CODE} from './auth.interceptor';
import {AuthService} from './auth.service';

describe('AuthInterceptor', () => {

    let sut;
    let authService;

    beforeEach(() => {
        authService = jasmine.createSpyObj<AuthService>('authService', ['getAuthHeader', 'login', 'authenticated']);
        sut = new AuthInterceptor(authService);
    });

    describe('intercept', () => {

        it('must throw an error in case of a failed request', done => {
            // given
            const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
            const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
            const authHeader = {'Authorization': 'Bearer some token'};
            const errorMessage = 'Something went wrong';

            next.handle.and.returnValue(ErrorObservable.create(errorMessage));
            authService.getAuthHeader.and.returnValue(authHeader);
            authService.authenticated.and.returnValue(true);

            // when
            const intercept$ = sut.intercept(request, next);

            // then
            const observer = {
                error: error => {
                    expect(error).toEqual(errorMessage);
                    done();
                }
            };
            intercept$.subscribe(observer);
        });

        it('must call login on the authService for unauthorized requests', done => {
            // given
            const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
            const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
            const authHeader = {'Authorization': 'Bearer some token'};
            const error = {
                error: 'Something went wrong',
                status: HTTP_STATUS_CODE.UNAUTHORIZED
            };
            const httpError = new HttpErrorResponse(error);

            next.handle.and.returnValue(ErrorObservable.create(httpError));
            authService.getAuthHeader.and.returnValue(authHeader);
            authService.authenticated.and.returnValue(true);

            // when
            const intercept$ = sut.intercept(request, next);

            // then
            const observer = {
                error: err => {
                    expect(err).toEqual(httpError);
                    expect(authService.login).toHaveBeenCalled();
                    done();
                }
            };
            intercept$.subscribe(observer);
        });

        it('must call login on the authService for forbidden requests', done => {
            // given
            const request = jasmine.createSpyObj<HttpRequest<any>>('request', ['clone']);
            const next = jasmine.createSpyObj<HttpHandler>('next', ['handle']);
            const authHeader = {'Authorization': 'Bearer some token'};
            const error = {
                error: 'Something went wrong',
                status: HTTP_STATUS_CODE.FORBIDDEN
            };
            const httpError = new HttpErrorResponse(error);

            next.handle.and.returnValue(ErrorObservable.create(httpError));
            authService.getAuthHeader.and.returnValue(authHeader);

            // when
            const intercept$ = sut.intercept(request, next);

            // then
            const observer = {
                error: err => {
                    expect(err).toEqual(httpError);
                    expect(authService.login).toHaveBeenCalled();
                    done();
                }
            };
            intercept$.subscribe(observer);
        });
    });
});
