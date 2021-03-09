import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginForm } from '../models/login-form';
import { AuthenticationService } from '../services/authentication.service';
import { AppComponent } from '../app.component';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy{
  submitted = false;
  model = new LoginForm('', '');

  private authStatusSub: Subscription;
  userIsAuthenticated = false;

  constructor(private authenticationService: AuthenticationService, private appComponent: AppComponent) { }

  ngOnInit(){

    this.userIsAuthenticated = this.authenticationService.getIsAuth();
    this.authStatusSub = this.authenticationService.getAuthStatusListener()
      .subscribe(autStatus => {
      });
  }

  onSubmit(){
    this.submitted = true;
    this.authenticationService.login(this.model)
      .subscribe(user=>{
        if(user){
          this.userIsAuthenticated = true;
          this.appComponent.name = 'Bienvenido '+user.data.full_name;
          this.appComponent.isAuthenticated = true;
        }
      })
  }

  newLogin() {
    this.model = new LoginForm('', '');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }



}
