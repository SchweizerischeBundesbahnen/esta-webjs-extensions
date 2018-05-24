import { KeycloakInitOptions } from 'keycloak-js';
import * as Keycloak_ from 'keycloak-js';

import { AuthService } from './auth.service';
import { KeycloakConfig } from './keycloak-config';

// This workaround is required, due to: https://github.com/rollup/rollup/issues/670
const Keycloak = Keycloak_;

export function authInit(
  keycloakOptions: KeycloakInitOptions,
  keycloakConfig: string | KeycloakConfig,
  authService: AuthService) {
  return async () => {
    authService.keycloak = Keycloak(keycloakConfig);
    await new Promise(resolve => {
      authService.keycloak.init(keycloakOptions)
        .success(() => resolve())
        .error((error: Keycloak.KeycloakError) => {
          console.warn(error);
          resolve();
        });
    });
  };
}
