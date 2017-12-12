import { Component, OnInit } from '@angular/core';
import { KeycloakProfile } from 'keycloak-js';
import { Observable } from 'rxjs/Observable';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'sbb-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
