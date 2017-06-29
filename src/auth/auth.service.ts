/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Authentication Service for KeyCloak
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 22.06.2017, 2017.
 */
import {Injectable} from '@angular/core';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/never';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {KeycloakProfile} from './keycloakProfile.model';
const Keycloak = require('keycloak-js');

@Injectable()
export class AuthService {
    static keycloak: any = undefined;
    static userProfile: BehaviorSubject<KeycloakProfile> = new BehaviorSubject(null);

    public static init(options?: any, configUrl?: string): Promise<any> {
        AuthService.keycloak = AuthService.createKeycloak(configUrl);

        return new Promise((resolve, reject) => {
            AuthService.keycloak.init(options)
                .success(() => {
                    resolve();
                })
                .error((errorData: any) => {
                    reject(errorData);
                });
        });
    }

    static createKeycloak(configUrl) {
        return new Keycloak(configUrl);
    }

    public login(): void {
        AuthService.keycloak.login();
    }

    public logout(): void {
        AuthService.keycloak.logout();
    }

    public authenticated(): boolean {
        return AuthService.keycloak.authenticated;
    }

    public refreshToken(minValidity: number = 5): Promise<boolean> {
        return new Promise((resolve, reject) => {
            AuthService.keycloak.updateToken(minValidity)
                .success(() => resolve(true))
                .error((err) => reject(err));
        });
    }

    public getToken(): string {
        return AuthService.keycloak.token;
    }

    public getAuthHeader(): any {
        return {
            'Authorization': 'Bearer ' + this.getToken()
        };
    }

    public getUserInfo(): Observable<KeycloakProfile> {
        if (this.authenticated() && !AuthService.keycloak.profile) {
            AuthService.keycloak.loadUserProfile()
                .success(profile => {
                    AuthService.userProfile.next(profile);
                })
                .error(err => {
                    throw new Error(err);
                });
        }
        return AuthService.userProfile.asObservable();
    }
}
