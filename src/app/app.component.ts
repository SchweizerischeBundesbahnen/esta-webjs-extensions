import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { Observable } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  profile: Observable<KeycloakProfile>;

  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    this.profile = this.authService.getUserInfo();
  }

  test() {
    this.authService.login();
  }
}
