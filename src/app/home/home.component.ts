import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service'
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  forms=[];
  userForms=[]
  constructor(private _authService:AuthService) { 
   
  }
  updatedata(){
    this._authService.getUserDetails()
    .subscribe(
      (res) =>{
        this.userForms = res.forms
        this._authService.setUserDetails(res.email,res._id,res.forms);

      },
      err => console.log(err)
    )
  }
  deleteForm(formName){

     this._authService.deleteForm(formName).subscribe((res)=>{
       console.log(res)
     },(err)=>{
       console.log(err)
     })
     this.updatedata()
  }

  ngOnInit() {
   this.updatedata()
  }
 

}
