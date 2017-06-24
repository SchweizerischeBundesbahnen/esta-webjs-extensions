# Esta Web JS Exstentions
This projects contains all extensions for the Webstack Esta WebJS 2.
Currently we offer the following extensions:
- Authentication Module

## Getting started
To use the esta-webjs-extensions you need to have node and npm installed.
You can then install esta webjs extensions with the following command:

```
npm install --save esta-webjs-extensions
```

## Authentication Module

The authentication module provides functionality for SSO Sign in
with Keycloak at SBB. It provides you an authentication service that you
can use to handle all your authentication tasks.

### How to use the authentication module
After you have installed the esta-webjs-extensions package you can import
the authentication module inside your angular 2 application like follows:

```
TODO
```

Inside your component you can then use the service in the following way:
```
TODO
```

### Authentication Service
The Authentication Service provides the nescessary API to interact with
the authentication module.

| Method                                   	| Description                                                                                                                                                                                                                                                                                                                                                                                                 	|
|------------------------------------------	|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------	|
| login: void                              	| When you call this method you are redirected to the authentication server where you need to enter your credentials. After a successfull login you are then redirect to your app. The AuthModule then internally stores the authorization token. This token is stored persistent. It is also available after a window refresh. You can get the token by calling the getToken() method of the auth service.   	|
| getToken: string                         	| This method returns the stored token. Notice that it only returns the token and not the complete authHeader. To get the authHeader you can use the getAuthHeader() method on the authService.                                                                                                                                                                                                               	|
| getAuthHeader: any                       	| This method returns an auth header object. This auth header object has an Authorization property that contains Bearer + token as value.                                                                                                                                                                                                                                                                     	|
| refreshToken: Promise<boolean>           	| This method allows you to refresh the token. It returns a promise that indicates if the refresh has been successfull or not. Don't forget to call getToken() again to get the refreshed token.                                                                                                                                                                                                              	|
| getUserInfo: Observable<KeycloakProfile> 	| This method returns you an Observable who streams the user profile. This user profile has the following structure. - id?: string - username?: string - email?: string - firstName?: string - lastName?: string - enabled?: boolean - emailVerified?: boolean - totp?: boolean - createdTimestamp?: number                                                                                                   	|
| authenticated: boolean                   	| Returns a boolean that identicates if the user is authenticated or not.                                                                                                                                                                                                                                                                                                                                     	|
| logout: void                             	| logout: voidThis method will logout the current user and remove the token from the auth module.                                                                                                                                                                                                                                                                                                             	|
