import {Injectable} from '@angular/core';
import {KeycloakInstance, KeycloakProfile} from 'keycloak-js';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {of} from 'rxjs/observable/of';

@Injectable()
export class AuthService {

    keycloak: KeycloakInstance;

    login(): void {
        this.keycloak.login();
    }

    logout(): void {
        this.keycloak.logout();
    }

    authenticated(): boolean {
        return this.keycloak.authenticated;
    }

    refreshToken(minValidity: number = 5): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.keycloak.updateToken(minValidity)
                .success(resolve)
                .error(reject);
        });
    }

    getToken(): string {
        return this.keycloak.token;
    }

    public getAuthHeader(): any {
        return {
            'Authorization': 'Bearer ' + this.getToken()
        };
    }

    getUserInfo(): Observable<KeycloakProfile | undefined> {
        if (!this.authenticated() || this.keycloak.profile) {
            return of(this.keycloak.profile);
        }

        return fromPromise(new Promise((resolve, reject) => {
            this.keycloak.loadUserProfile()
                .success(resolve)
                .error(err => reject(err));
        }));
    }
}
