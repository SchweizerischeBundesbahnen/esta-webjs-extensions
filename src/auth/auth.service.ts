import {Injectable} from '@angular/core';
import {KeycloakInstance, KeycloakLoginOptions, KeycloakProfile} from 'keycloak-js';
import {Observable} from 'rxjs/Observable';
import {fromPromise} from 'rxjs/observable/fromPromise';
import {of} from 'rxjs/observable/of';
import {HttpHeaders} from '@angular/common/http';

@Injectable()
export class AuthService {

    keycloak: KeycloakInstance;

    public login(options?: KeycloakLoginOptions): void {
        this.keycloak.login(options);
    }

    public logout(options?: any): void {
        this.keycloak.logout(options);
    }

    public authenticated(): boolean {
        return this.keycloak.authenticated;
    }

    public refreshToken(minValidity: number = 5): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.keycloak.updateToken(minValidity)
                .success(resolve)
                .error(reject);
        });
    }

    public getToken(): string {
        return this.keycloak.token;
    }

    public getAuthHeader(): HttpHeaders {
        const authToken = this.getToken();
        return new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
    }

    public getUserInfo(): Observable<KeycloakProfile | undefined> {
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
