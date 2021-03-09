import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { GetUsers } from '../models/get-users';

import { Observable, of } from 'rxjs';
import {User} from "../models/user";
import {environment} from "../../environments/environment";


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private getAllUserUrl = environment.apiUrl + '/users/getall';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log("error");
      return of(result as T);
    };
  }

  getAllUser(): Observable<GetUsers[]> {
    return this.http.get<GetUsers[]>(this.getAllUserUrl, this.httpOptions).pipe(
      tap((newUser: GetUsers[]) => console.log("get all users")),
      catchError(this.handleError<GetUsers[]>('Login',[]))
    );
  }

  constructor(private http: HttpClient) { }
}
