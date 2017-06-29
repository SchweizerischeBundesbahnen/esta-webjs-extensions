/**
 * Copyright (C) Schweizerische Bundesbahnen SBB, 2017.
 *
 * ESTA WebJS: Authentication Module for KeyCloak
 *
 * @author u218609 (Kevin Kreuzer)
 * @version: 2.0.0
 * @since 22.06.2017, 2017.
 */
import {NgModule} from '@angular/core';
import {AuthService} from './auth.service';

@NgModule({
    providers: [AuthService]
})
export class AuthModule {
}
