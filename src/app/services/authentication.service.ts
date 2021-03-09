import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Observable, of, Subject } from 'rxjs';
import { environment } from "../../environments/environment";
import {LoginForm} from "../models/login-form";
import {User} from "../models/user";
import {UserForm} from "../models/user-form";

const userLoginUrl = environment.apiUrl + "/auth/signin";
const userSignupUrl = environment.apiUrl + "/auth/signup";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated = false;
  private tokenTimer: any;
  private userId: string;

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private router: Router, private http: HttpClient) { }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.authStatusListener.next(false);
      console.log("error");
      return of(result as T);
    };
  }

  login(login: LoginForm): Observable<User> {
    return this.http.post<User>(userLoginUrl, login, this.httpOptions).pipe(
      tap((newUser: User) => {
        this.token = newUser.data.token;
        const expireInDuration = newUser.data.expiresIn;
        this.setAuthTimer(expireInDuration);
        this.isAuthenticated = true;
        this.userId = newUser.data.id.toString();
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
        this.saveAuthData(this.token, expirationDate, this.userId);

      }),
      catchError(this.handleError<User>('Login'))
    );
  }

  signup(userForm: UserForm): Observable<User>{
    return this.http.post<User>(userSignupUrl, userForm, this.httpOptions).pipe(
      tap((newUser: User) => {
        this.token = newUser.data.token;
        const expireInDuration = newUser.data.expiresIn;
        this.setAuthTimer(expireInDuration);
        this.isAuthenticated = true;
        this.userId = newUser.data.id.toString();
        this.authStatusListener.next(true);
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
        this.saveAuthData(this.token, expirationDate, this.userId);

      }),
      catchError(this.handleError<User>('signup'))
    );


  }

  autoAuthUser(){
    const authInformation = this.getAuthData();
    if (!authInformation){
      return;
    }
    const now = new Date();
    const expireIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expireIn > 0){
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expireIn / 1000);
      this.authStatusListener.next(true);
    }

  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.userId = null;
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number){
    console.log("Setting timer= ", duration);
    //trabaja en milisegundos, por eso multiplicar 1000
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData (token: string, expirationDate: Date, userId: string){

    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate){
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }

  }

  getToken(){
    return this.token;
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUserId(){
    return this.userId;
  }

}
