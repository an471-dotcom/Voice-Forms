import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import {MatSnackBar} from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  content:string;
  registerUserData = {}
  loginUserData = {}
  constructor(private _auth:AuthService,private _router:Router,private _snackBar: MatSnackBar) { 
    this.content = "landing"
  }

  ngOnInit() {
  }
  registerUser(){
    this._auth.registerUser(this.registerUserData)
    .subscribe(
      res => {
        console.log(res)
        localStorage.setItem('token',res.token)
        this._router.navigate(['/home'])
      },
      err => console.log(err)
    )
  }
  loginUser(){
    this._auth.loginUser(this.loginUserData)
    .subscribe(
      res =>{
        console.log(res)
        this._snackBar.open('Login Successfull', 'close', {
          duration: 2000
          });
        localStorage.setItem('token',res.token)
        this._router.navigate(['/home'])
      },
      err =>{
        this._snackBar.open(err.error, 'close', {
          duration: 3000
          });
        console.log(err.error)
      } 
    )
  }
} 
