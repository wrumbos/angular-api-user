import { Component, OnInit } from '@angular/core';

import { UserService } from '../services/user.service';
import {GetUsers} from "../models/get-users";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: GetUsers[];

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.getUser();
  }

  getUser(): void {
    this.userService.getAllUser()
      .subscribe(user => this.user = user);
  }


}
