import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private  _registerUrl = "http://localhost:3000/signup";
  private _loginUrl = "http://localhost:3000/login";
  private userEmail="";
  private userId="";
  private forms:any=[];
  constructor(private http:HttpClient,private _router:Router) {
    localStorage.removeItem('token')
   }
  registerUser(user){
    this.userEmail = user.email;
    return this.http.post<any>(this._registerUrl,user)
  }

  loginUser(user){
    this.userEmail = user.email;
    return this.http.post<any>(this._loginUrl,user)
  }
  loggedIn(){
    return !!localStorage.getItem('token');
  }
  logoutUser(){
    localStorage.removeItem('token')
    this._router.navigate(['']);
  }
  getToken(){
    return localStorage.getItem('token');
  }
  getUserDetails(){
    // this.userEmail = "alwin.com";
    let  _userDetUrl = `http://localhost:3000/user/${this.userEmail}`
    return this.http.get<any>(_userDetUrl)
  }
  setUserDetails(userEmail,userId,forms){
    this.userEmail = userEmail;
    this.userId = userId;
    this.forms = forms
  }
  
  saveForm(form){
    // this.userId = "62974acbfdf7d24c75a38230";
    let saveFormUrl = `http://localhost:3000/create/${this.userId}`;
    return this.http.post<any>(saveFormUrl,form)
  }
  updateForm(formheading,formObj){
    // this.userId = "62974acbfdf7d24c75a38230";
    let updateFormUrl = `http://localhost:3000/update/${this.userId}/${formheading}`
    return this.http.post<any>(updateFormUrl,formObj)
  }
  deleteForm(formheading){
    // this.userId = "62974acbfdf7d24c75a38230";
    let deleteFormUrl = `http://localhost:3000/delete/${this.userId}/${formheading}`
    return this.http.get<any>(deleteFormUrl)
  }
}
