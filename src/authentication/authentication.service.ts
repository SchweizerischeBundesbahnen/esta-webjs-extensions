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
export class EstaAuthService {
    static keycloak: any;
    static userProfile: BehaviorSubject<KeycloakProfile> = new BehaviorSubject(null);

    public static init(options?: any, configUrl?: string): Promise<any> {
        EstaAuthService.keycloak = EstaAuthService.createKeycloak(configUrl);

        return new Promise((resolve, reject) => {
            EstaAuthService.keycloak.init(options)
                .success(() => {
                    console.log('Resolved');
                    resolve();
                })
                .error((errorData: any) => {
                    reject(errorData);
                });
        });
    }

    static createKeycloak(configUrl){
        return new Keycloak(configUrl);
    }

    public login(): void {
        EstaAuthService.keycloak.login();
    }

    public logout(): void {
        EstaAuthService.keycloak.logout();
    }

    public authenticated(): boolean {
        return EstaAuthService.keycloak.authenticated;
    }

    public refreshToken(minValidity: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            EstaAuthService.keycloak.updateToken(minValidity)
                .success(() => resolve())
                .error((err) => reject(err));
        });
    }

    public getToken(): string {
        return EstaAuthService.keycloak.token;
    }

    public getAuthHeader(): any {
        return {
            'Authorization': 'Bearer ' + this.getToken()
        };
    }

    public getUserInfo(): Observable<KeycloakProfile> {
        if (this.authenticated() && !EstaAuthService.keycloak.profile) {
            EstaAuthService.keycloak.loadUserProfile()
                .success(profile => {
                    EstaAuthService.userProfile.next(profile);
                })
                .error(err => EstaAuthService.userProfile.error(err));
        }

        return EstaAuthService.userProfile.asObservable();
    }
}