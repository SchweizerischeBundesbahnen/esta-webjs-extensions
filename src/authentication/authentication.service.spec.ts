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
});
