/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Test für den Authenticationservice
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 22.06.2017, 2017.
 */
import {AuthService} from './auth.service';
import {KeycloakProfile} from './keycloak-profile.model';

const Keycloak = require('keycloak-js');

describe('Auth Service', () => {

    it(`should init Keycloak and return a promise which resolves when the init
    call with the options was successfull`, done => {
        // given
        const options = {};
        const keyCloakMock = {
            init: () => ({
                success: callback => callback()
            })
        };
        spyOn(AuthService, 'createKeycloak').and.returnValue(keyCloakMock);
        // when
        const promise = AuthService.init(options);
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
        spyOn(AuthService, 'createKeycloak').and.returnValue(keyCloakMock);
        // when
        const promise = AuthService.init(options);
        // then
        promise.then(
            () => fail(),
            err => {
                expect(err).toBe(errorMessage);
                done();
            }
        );
    });

    it('should call .login on the AuthService.keycloak on login', () => {
        // given
        const sut = new AuthService();
        AuthService.keycloak = {
            login: () => {
            }
        };
        spyOn(AuthService.keycloak, 'login');
        // when
        sut.login();
        // then
        expect(AuthService.keycloak.login).toHaveBeenCalled();
    });

    it('should call .logout on the AuthService.keycloak on logout', () => {
        // given
        const sut = new AuthService();
        AuthService.keycloak = {
            logout: () => {
            }
        };
        spyOn(AuthService.keycloak, 'logout');
        // when
        sut.logout();
        // then
        expect(AuthService.keycloak.logout).toHaveBeenCalled();
    });

    it(`should return the value of .authenticated on the EstaAuthService.keycloak
    when we call authenticated`, () => {
        // given
        const sut = new AuthService();
        AuthService.keycloak = {
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
        const sut = new AuthService();
        const expectedToken = '123-456-789';
        AuthService.keycloak = {token: expectedToken};
        // when
        const token = sut.getToken();
        // then
        expect(token).toBe(expectedToken);
    });

    it('should return the AuthHeader when we call getAuthHeader', () => {
        // given
        const sut = new AuthService();
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
        const sut = new AuthService();
        const minValidity = 5;
        const keyCloakMock = {
            updateToken: () => ({
                success: callback => callback()
            })
        };
        AuthService.keycloak = keyCloakMock;
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
        const sut = new AuthService();
        const minValidity = 5;
        const errorMessage = 'The refresh of the token failed';
        const keyCloakMock = {
            updateToken: () => ({
                success: () => ({
                    error: callback => callback(errorMessage)
                })
            })
        };
        AuthService.keycloak = keyCloakMock;
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
        const sut = new AuthService();
        const userprofile = {
            firstname: 'Ruffy',
            name: 'Monkey D'
        } as KeycloakProfile;
        AuthService.userProfile.next(userprofile);
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
        const sut = new AuthService();
        const userprofile = {
            firstname: 'Ruffy',
            name: 'Monkey D'
        } as KeycloakProfile;
        AuthService.keycloak = {
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
        const sut = new AuthService();
        const errorMessage = 'An error occured while loading the profile';
        AuthService.keycloak = {
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
