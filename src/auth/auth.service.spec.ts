/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Test für den Authenticationservice
 *
 * @author u218609 (Kevin Kreuzer)
 * @author ue88070 (Lukas Spirig)
 * @version: 2.0.0
 * @since 11.12.2017, 2017.
 */
import {KeycloakProfile} from 'keycloak-js';

import {AuthService} from './auth.service';

describe('AuthService', () => {

    it('should call .login on the AuthService.keycloak on login', () => {
        // given
        const sut = new AuthService();
        sut.keycloak = {
            login: () => {
            }
        } as any;
        spyOn(sut.keycloak, 'login');
        // when
        sut.login();
        // then
        expect(sut.keycloak.login).toHaveBeenCalled();
    });

    it('should call .logout on the AuthService.keycloak on logout', () => {
        // given
        const sut = new AuthService();
        sut.keycloak = {
            logout: () => {
            }
        } as any;
        spyOn(sut.keycloak, 'logout');
        // when
        sut.logout();
        // then
        expect(sut.keycloak.logout).toHaveBeenCalled();
    });

    it(`should return the value of .authenticated on the EstaAuthService.keycloak
    when we call authenticated`, () => {
        // given
        const sut = new AuthService();
        sut.keycloak = {
            authenticated: true
        } as any;
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
        sut.keycloak = {token: expectedToken} as any;
        // when
        const token = sut.getToken();
        // then
        expect(token).toBe(expectedToken);
    });

    it(`should return a promise when we call refreshToken. This promise must be
        resolved when the refresh was successfull`, done => {
        // given
        const sut = new AuthService();
        const minValidity = 5;
        const keyCloakMock = {
            updateToken: () => ({
                success: callback => callback(true)
            })
        };
        sut.keycloak = keyCloakMock as any;
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
        sut.keycloak = keyCloakMock as any;
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
        const profile = {
            firstname: 'Ruffy',
            name: 'Monkey D'
        } as KeycloakProfile;
        sut.keycloak = {profile} as any;
        spyOn(sut, 'authenticated').and.returnValue(false);
        sut.getUserInfo()
            .subscribe(p => expect(p).toEqual(profile));
    });

    it(`should load the userprofile if the user is authenticated and Keycloak has no profile yet.
    It should then stream the loaded profile`, () => {
        // given
        const sut = new AuthService();
        const userprofile = {
            firstname: 'Ruffy',
            name: 'Monkey D'
        } as Keycloak.KeycloakProfile;
        sut.keycloak = {
            profile: undefined,
            loadUserProfile: () => ({
                success: callback => {
                    callback(userprofile);
                    return {
                        error: () => {
                        }
                    };
                }
            })
        } as any;
        spyOn(sut, 'authenticated').and.returnValue(true);
        sut.getUserInfo()
            .subscribe(profile => expect(profile).toEqual(userprofile));
    });

    it(`should load the userprofile if the user is authenticated and Keycloak has no profile yet.
    It should then stream an error if an error occured during the loading of the profile`, () => {
        // given
        const sut = new AuthService();
        const errorMessage = 'An error occured while loading the profile';
        sut.keycloak = {
            profile: false,
            loadUserProfile: () => ({
                success: () => ({
                    error: errorCallback => errorCallback(errorMessage)
                })
            })
        } as any;
        spyOn(sut, 'authenticated').and.returnValue(true);
        // when - then
        sut.getUserInfo()
            .subscribe(
                p => {
                    throw new Error('Unexpected!');
                },
                e => expect(e).toEqual(errorMessage));
    });

    it('must return the AuthHeader with the token', () => {
        // given
        const sut = new AuthService();
        const authToken = 'fdsad-asdfgh-adfasg-adsfg';
        const expectedAuthHeader = {
            'Authorization': `Bearer ${authToken}`
        };
        spyOn(sut, 'getToken').and.returnValue(authToken);
        // when
        const authHeader = sut.getAuthHeader();
        // then
        expect(authHeader).toEqual(expectedAuthHeader);
    });
});
