import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AUTH_INTERCEPTOR, AuthModule } from 'esta-webjs-extensions';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AuthModule.forRoot(environment.authConfig),
  ],
  providers: [
    AUTH_INTERCEPTOR,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
