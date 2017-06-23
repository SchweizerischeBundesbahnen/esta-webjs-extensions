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

    it(`should return a promise when we call refreshToken. This promise must be 
        resolved when the refresh was successfull`, done => {
        // given
        const sut = new EstaAuthService();
        const minValidity = 5;
        const keyCloakMock = {
            updateToken: () => ({
                success: callback => callback()
            })
        };
        EstaAuthService.keycloak = keyCloakMock;
        // when
        const promise = sut.refreshToken(minValidity);
        // then
        promise.then(refreshed => {
                expect(refreshed).toBeTruthy();
                done();
            },
            err => fail('Promise was not resolved')
        );
    });

    it(`should return a promise when we call refreshToken. This promise must be 
        rejected when an error during refresh occured`, done => {
        // given
        const sut = new EstaAuthService();
        const minValidity = 5;
        const errorMessage = 'The refresh of the token failed';
        const keyCloakMock = {
            updateToken: () => ({
                success: () => ({
                    error: callback => callback(errorMessage)
                })
            })
        };
        EstaAuthService.keycloak = keyCloakMock;
        // when
        const promise = sut.refreshToken(minValidity);
        // then
        promise.then(
            () => fail(),
            err => {
                expect(err).toBe(errorMessage);
                done();
            });
    });

    it(`should return an Observable that streams the userprofile`, () => {
        // given
        const sut = new EstaAuthService();
        const userprofile = {
            firstname: 'Ruffy',
            name: 'Monkey D'
        };
        EstaAuthService.userProfile.next(userprofile);
        spyOn(sut, 'authenticated').and.returnValue(false);
        // when
        const userprofile$ = sut.getUserInfo();
        // then
        userprofile$.subscribe(
            profile => expect(profile).toEqual(userprofile)
        );
    });

    it(`should load the userprofile if the user is authenticated and Keycloak has no profile yet.
    It should then stream the loaded profile`, () => {
        // given
        const sut = new EstaAuthService();
        const userprofile = {
            firstname: 'Ruffy',
            name: 'Monkey D'
        };
        EstaAuthService.keycloak = {
            profile: false,
            loadUserProfile: () => ({
                success: callback => {
                    callback(userprofile);
                    return {
                        error: () => {
                        }
                    };
                }
            })
        };
        spyOn(sut, 'authenticated').and.returnValue(true);
        // when
        const userprofile$ = sut.getUserInfo();
        // then
        userprofile$.subscribe(
            profile => expect(profile).toEqual(userprofile)
        );
    });

    it(`should load the userprofile if the user is authenticated and Keycloak has no profile yet.
    It should then stream an error if an error occured during the loading of the profile`, () => {
        // given
        const sut = new EstaAuthService();
        const errorMessage = 'An error occured while loading the profile';
        EstaAuthService.keycloak = {
            profile: false,
            loadUserProfile: () => ({
                success: () => ({
                    error: errorCallback => errorCallback(errorMessage)
                })
            })
        };
        spyOn(sut, 'authenticated').and.returnValue(true);
        // when - then
        expect(() => sut.getUserInfo()).toThrowError(errorMessage);
    });
});
