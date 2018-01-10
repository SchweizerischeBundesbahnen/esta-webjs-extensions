import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AUTH_INTERCEPTOR } from '../auth/auth.interceptor';
import { AuthModule } from '../auth/auth.module';
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
