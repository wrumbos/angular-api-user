import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import { UserForm } from '../models/user-form';
import { AuthenticationService } from '../services/authentication.service';
import { AppComponent } from '../app.component';
import {Subscription} from "rxjs";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit, OnDestroy{

  private authStatusSub: Subscription;
  userIsAuthenticated = false;


  model = new UserForm('', '', '', '', '', '');
  submitted = false;

  constructor(private authenticationService: AuthenticationService,
              @Inject(DOCUMENT) private _document: Document,
              private appComponent: AppComponent) { }

  ngOnInit(){
    this.userIsAuthenticated = this.authenticationService.getIsAuth();
    this.authStatusSub = this.authenticationService.getAuthStatusListener()
      .subscribe(autStatus => {
      });
  }

  onSubmit(){
    this.submitted = true;
    this.authenticationService.signup(this.model).subscribe(user=>{
      if(user){
        this.userIsAuthenticated = true;
        this.appComponent.name = 'Bienvenido '+user.data.full_name;
        this.appComponent.isAuthenticated = true;
      }
    });


  }

  newUser() {
    this.model = new UserForm('', '', '', '', '', '');
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

}
