import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormService } from 'src/form.service';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { FormPreview } from '../create/create.component';
@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {
  
  
  myForm:[]=[];
  id:string=""
  textInputs:string[]=['text','email','date','password','number']
  constructor(private _authService:AuthService,private formService:FormService,private _router:Router,private _snackBar: MatSnackBar,private route:ActivatedRoute) { 
    
    
    this.id = this.route.snapshot.paramMap.get('id');
  
    if(this.id){
    this._authService.getUserDetails().subscribe((res)=>{
    this.myForm = res.forms.find(e=> e.heading == this.id)
      console.log(this.myForm)
    },
    (err)=>{
      console.log(err)
    })
   }
    else if(this.formService.getvalue()){
     this.myForm = this.formService.getvalue()
    }
    else{
      this._router.navigate(['/create'])
      this._snackBar.open('create a form to preview', 'close', {
        duration: 3000
        });
    }
  
}

  
  dwld():void{
    var a = document.body.appendChild(
      document.createElement("a")
  );
  a.download = "export.html";
  a.href = "data:text/html," + document.getElementById("form").innerHTML;
  a.id="dwld"
  a.innerHTML = "[Export conent]";
  document.getElementById('dwld').click();
  }
  ngOnInit() {}
   
}
