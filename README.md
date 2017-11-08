# Esta Web JS Exstentions

  * [Getting started](#getting-started)
  * [Authentication module](#authentication-module)
    + [How to use the authentication module](#how-to-use-the-authentication-module)
    + [Authentication service](#authentication-service)

This project contains all extensions for esta-webjs-2.
Currently we offer the following extensions:
- Auehentication module

## Getting started
To use esta-webjs-extensions you need to have node and npm installed.
You can then install esta-webjs-extensions with the following command:

```
npm install --save esta-webjs-extensions
```

## Authentication Module
The authentication module provides functionality for SSO
with Keycloak at SBB. It provides an authentication service that you
can use to handle all your authentication tasks.

### How to use the authentication module
After the redirect from the authentication server, keycloak needs to be
notified even before Angular has started. This is why we call the init method
 of the Authservice before Angular has loaded. The init method returns
  us a promise. After the promise is resolved or rejected we bootstrap angular
  with our main application. Your main.ts should look like this:

```
import './polyfills.ts';

import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {enableProdMode} from '@angular/core';
import {environment} from './environments/environment';
import {AppModule} from './app/app.module';
import {AuthService} from 'esta-webjs-extensions';

if (environment.production) {
  enableProdMode();
}

AuthService.init({onLoad: 'check-sso'}, 'assets/auth-config.json')
  .then(() => {
      startAngular();
  })
  .catch((err) => {
    console.warn('Error starting app with keycloak auth-service. Do you have the auth-config.json? Starting angular anyway', err);
    startAngular();
  });

function startAngular() {
  platformBrowserDynamic().bootstrapModule(AppModule);
}
```

After the set up is done you can import the Authmodule in your app module or in your core module.

```
/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Core Module
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 28.04.2017, 2017.
 */
 ...
import {AuthModule} from 'esta-webjs-extensions';

@NgModule({
  imports: [
    AuthModule
  ]
  declarations: [...]
})
export class CoreModule {
}
```

By importing the Authmodule the Authservice is now available over dependency injection inside your application.
```
import {AuthService} from 'esta-webjs-extensions';

@Component({
    selector: ...,
    templateUrl: ...
})
export class SampleComponent{

    constructor(private authService: AuthService){
    }
}
```

### Authentication Service
The Authentication Service provides the necessary API to interact with
the authentication module.

| Method                                   	| Description                                                                                                                                                                                                                                                                                                                                                                                                 	|
|------------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| login: void                              	| When you call this method you are redirected to the authentication server where you need to enter your credentials. After a successfull login you are then redirect to your app. The AuthModule then internally stores the authorization token. This token is stored persistent. It is also available after a window refresh. You can get the token by calling the getToken() method of the auth service.   	|
| getToken: string                         	| This method returns the stored token. Notice that it only returns the token and not the complete authHeader. To get the authHeader you can use the getAuthHeader() method on the authService.                                                                                                                                                                                                               	|
| getAuthHeader: any                       	| This method returns an auth header object. This auth header object has an authorization property that contains Bearer + token as value.                                                                                                                                                                                                                                                                     	|
| refreshToken: Promise<boolean>           	| This method allows you to refresh the token. It returns a promise that indicates if the refresh has been successfull or not. Don't forget to call getToken() again to get the refreshed token.                                                                                                                                                                                                              	|
| getUserInfo: Observable<KeycloakProfile> 	| This method returns you an Observable who streams the user profile. This user profile has the following structure. - id?: string - username?: string - email?: string - firstName?: string - lastName?: string - enabled?: boolean - emailVerified?: boolean - totp?: boolean - createdTimestamp?: number                                                                                                   	|
| authenticated: boolean                   	| Returns a boolean that identicates if the user is authenticated or not.                                                                                                                                                                                                                                                                                                                                     	|
| logout: void                             	| logout: voidThis method will logout the current user and remove the token from the auth module.                                                                                                                                                                                                                                                                                                             	|
