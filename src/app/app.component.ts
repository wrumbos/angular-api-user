import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public name;
  public isAuthenticated = false;

  constructor (private authService: AuthenticationService) {
  }

  ngOnInit(){
    this.authService.autoAuthUser();
    this.isAuthenticated = this.authService.getIsAuth();
  }

}
