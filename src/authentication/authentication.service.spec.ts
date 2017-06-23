/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Test für den Authenticationservice
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 22.06.2017, 2017.
 */
import {EstaAuthService} from './authentication.service';
const Keycloak = require('keycloak-js');

describe('Authentication Service', () => {

    it(`should init Keycloak and return a promise which resolves when the init 
    call with the options was successfull`, done => {
        // given
        const options = {};
        const keyCloakMock = {
            init: () => ({
                success: callback => callback()
            })
        };
        spyOn(EstaAuthService, 'createKeycloak').and.returnValue(keyCloakMock);
        // when
        const promise = EstaAuthService.init(options);
        // then
        promise.then(() => done(), err => fail('Promise was not resolved'));
    });

    it(`should init Keycloak and return a promise which is rejected when the init 
    call with the options failed`, done => {
        // given
        const options = {};
        const errorMessage = 'An unexpected error occured';
        const keyCloakMock = {
            init: () => ({
                success: () => {
                    return {
                        error: callback => callback(errorMessage)
                    };
                },
            })
        };
        spyOn(EstaAuthService, 'createKeycloak').and.returnValue(keyCloakMock);
        // when
        const promise = EstaAuthService.init(options);
        // then
        promise.then(
            () => fail(),
            err => {
                console.log('Hier', err);
                expect(err).toBe(errorMessage);
                done();
            }
        );
    });

    it('should call .login on the EstaAuthService.keycloak on login', () => {
        // given
        const sut = new EstaAuthService();
        EstaAuthService.keycloak = {
            login: () => {
            }
        };
        spyOn(EstaAuthService.keycloak, 'login');
        // when
        sut.login();
        // then
        expect(EstaAuthService.keycloak.login).toHaveBeenCalled();
    });

    it('should call .logout on the EstaAuthService.keycloak on logout', () => {
        // given
        const sut = new EstaAuthService();
        EstaAuthService.keycloak = {
            logout: () => {
            }
        };
        spyOn(EstaAuthService.keycloak, 'logout');
        // when
        sut.logout();
        // then
        expect(EstaAuthService.keycloak.logout).toHaveBeenCalled();
    });

    it(`should return the value of .authenticated on the EstaAuthService.keycloak 
    when we call authenticated`, () => {
        // given
        const sut = new EstaAuthService();
        EstaAuthService.keycloak = {
            authenticated: true
        };
        // when
        const isAuthenticated = sut.authenticated();
        // then
        expect(isAuthenticated).toBeTruthy();
    });

    it(`should return the value .token on the EstaAuthService.keycloak 
    when we call getToken`, () => {
        // given
        const sut = new EstaAuthService();
        const expectedToken = '123-456-789';
        EstaAuthService.keycloak = {token: expectedToken};
        // when
        const token = sut.getToken();
        // then
        expect(token).toBe(expectedToken);
    });

    it('should return the AuthHeader when we call getAuthHeader', () => {
        // given
        const sut = new EstaAuthService();
        const token = '123-456-789';
        spyOn(sut, 'getToken').and.returnValue(token);
        // when
        const authHeader = sut.getAuthHeader();
        // then
        expect(authHeader).toEqual({
            'Authorization': `Bearer ${token}`
        });
    });

});
