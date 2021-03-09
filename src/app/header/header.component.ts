import {Component, OnInit, OnDestroy, Inject} from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
import { AppComponent } from '../app.component';

import { Subscription } from 'rxjs';
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit, OnDestroy{

  userIsAuthenticated = false;
  private authListenerSubs: Subscription;

  constructor (private authService: AuthenticationService,
               @Inject(DOCUMENT) private _document: Document,
               private appComponent : AppComponent) {
  }

  ngOnInit(){
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
  }

  onLogOut(){
    this.authService.logout();
    this.appComponent.isAuthenticated = false;
    this._document.defaultView.location.reload();
  }

  ngOnDestroy(){
      this.authListenerSubs.unsubscribe();
  }
}
