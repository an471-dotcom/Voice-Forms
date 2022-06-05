import { Component, NgZone, OnInit ,ViewChild,ElementRef} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import { FormService } from 'src/form.service';
import { AuthService} from '../auth.service';
import {MatButton} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
declare const annyang: any;
export class ClassA {
	public fname:string;
	public type:string;
	public id:string;
	public name:string;
	public fields:string[];
	
	constructor(fname,type,id,name?,fields?){
	  this.fname = fname;
	  this.type = type;
	  this.id = id;
	  this.name = name;
	  this.fields = fields;
	}
  }
  export class FormPreview{
	  public heading:string;
	  public fields:any;
	  constructor(heading:string,fields:any){
		  this.heading = heading;
		  this.fields = fields;
	  }
  }
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  voiceActiveSectionDisabled: boolean = true;
	voiceActiveSectionError: boolean = false;
	voiceActiveSectionSuccess: boolean = false;
	voiceActiveSectionListening: boolean = false;
	voiceText: any;
	myForm:FormGroup;
	dasda=[]
	textInputs:string[]=['text','email','date','password','number']
	arr = Array<ClassA>();
	id:string = "";
	@ViewChild('fname', {static: false}) fieldName: ElementRef;
	@ViewChild('type', {static: false}) typeName: ElementRef;
	@ViewChild('id', {static: false}) idName: ElementRef;
	@ViewChild('nname', {static: false}) nName: ElementRef;
	@ViewChild('fields', {static: false}) fieldsName: ElementRef;
	@ViewChild('add', {static: false}) addbtn: MatButton;
	@ViewChild('clear', {static: false}) clearbtn: ElementRef;
	@ViewChild('head', {static: false}) headbtn: ElementRef;
  constructor(private ngZone: NgZone,private fb: FormBuilder,private _snackBar: MatSnackBar,private formService:FormService,private _authService:AuthService,private route: ActivatedRoute){
	this.myForm = this.fb.group({
				formArray: this.fb.array([])
			  });
		
			 
		
				this.arr.forEach(x => {
					let formArr = this.myForm.controls.formArray as FormArray;
				  formArr.push(this.fb.group({
					fname: [x.fname],
					type: [x.type],
					id: [x.id],
					name:[x.name],
					fields:[x.fields]
				  }))
				})
  }
  
//   render():void{
// 	this.myForm = this.fb.group({
// 		formArray: this.fb.array([])
// 	  });

	 

// 		this.arr.forEach(x => {
// 			let formArr = this.myForm.controls.formArray as FormArray;
// 		  formArr.push(this.fb.group({
// 			fname: [x.fname],
// 			type: [x.type],
// 			id: [x.id],
// 			name:[x.name],
// 			fields:[x.fields]
// 		  }))
// 		})
//   }
  display(fname, type, id, nname=null, fields=null) {
    let fieldsArr: string[];
    
      fieldsArr = fields.split('\n');
      this.arr.push(new ClassA(fname, type, id, nname, fieldsArr));
    
		this.clearfn()
		this._snackBar.open('Element Added', 'close', {
			duration: 3000
		  });
	console.log(this.arr)
  }
  preview():void{
  
	let obj = new FormPreview(this.headbtn.nativeElement.firstChild.textContent,this.arr);
	this.formService.setvalue(obj)
  console.log(obj);
  }
  dwld():void{
    var a = document.body.appendChild(
      document.createElement("a")
  );
  a.download = "export.html";
  a.href = "data:text/html," + document.getElementById("form").innerHTML;
  a.innerHTML = "[Export conent]";
  }
  clearfn(){
	  this.fieldName.nativeElement.value ='';
	  this.typeName.nativeElement.value ='' ;
	  this.idName.nativeElement.value ='' ;
	  this.nName.nativeElement.value ='' ;
	  this.fieldsName.nativeElement.value ='' ;
	  this._snackBar.open('cleared', 'X', {
		duration: 3000
	  });
  }
  deleteItem(item:ClassA):void{
	let indexToDelete = this.arr.findIndex(i => i.fname === item.fname);
	console.log(indexToDelete)
    if (indexToDelete !== -1) {
      this.arr.splice(indexToDelete, 1);
    }
	
	this._snackBar.open('Element Deleted', 'close', {
		duration: 3000
	  });
  }
 
save(){
	let obj = new FormPreview(this.headbtn.nativeElement.firstChild.textContent,this.arr);
	this._authService.saveForm(obj).subscribe((res)=>{
		console.log(res)
		this._snackBar.open('Form Saved', 'close', {
			duration: 3000
		  });
	},(err)=>console.log(err))
}
update(){
	let obj = new FormPreview(this.headbtn.nativeElement.firstChild.textContent,this.arr);
	console.log(this.id)
	if(this.id){
	this._authService.updateForm(this.id,obj).subscribe((res)=>{
		console.log(res)
		this._snackBar.open('Form Updated Successfully', 'close', {
			duration: 3000
		  });
	},
	(err)=>{
		console.log(err)
	})
	}
	else{
		this._snackBar.open('Form Not Saved', 'close', {
			duration: 3000
		  });
	}
}
	ngOnInit() {
		this.id = this.route.snapshot.paramMap.get('id');
		if(this.id){
			let form;
			this._authService.getUserDetails().subscribe((res)=>{
				form = res.forms.find(e=> e.heading == this.id)
				this.headbtn.nativeElement.innerText = form.heading;
				this.arr =form.fields
				console.log(form)
				console.log(this.arr)
				
				
			},
			(err)=>{
				console.log(err)
			})
			
		}
	 }

  


	initializeVoiceRecognitionCallback(): void {
		annyang.addCallback('error', (err) => {
      if(err.error === 'network'){
        this.voiceText = "Internet is require";
        annyang.abort();
        this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
      } else if (this.voiceText === undefined) {
				this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('soundstart', (res) => {
      this.ngZone.run(() => this.voiceActiveSectionListening = true);
		});

		annyang.addCallback('end', () => {
      if (this.voiceText === undefined) {
        this.ngZone.run(() => this.voiceActiveSectionError = true);
				annyang.abort();
			}
		});

		annyang.addCallback('result', (userSaid) => {
			this.ngZone.run(() => this.voiceActiveSectionError = false);

			let queryText: any = userSaid[0];
		

			// annyang.abort();
      this.voiceText = queryText;
			this.ngZone.run(() => this.voiceActiveSectionListening = false);
      this.ngZone.run(() => this.voiceActiveSectionSuccess = true);
		});
	}

	startVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = false;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
    this.voiceText = undefined;
		let selected;
		if (annyang) {
			let commands = {
				'demo-annyang': () => { },
				'hello'       : () => { alert("hello!!!") },
				'add field'   : () => 
									 {
										//   this.addSkill();
				  					  console.log("working"); 
									},
				'select field name' : () => 
				                    {
										this.fieldName.nativeElement.focus()
										 selected = this.fieldName;
									},
				'select type' : () => 
									{
										this.typeName.nativeElement.focus()
										 selected = this.typeName;
									},
				'select id' : () => 
									{
										this.idName.nativeElement.focus()
										 selected = this.idName;
									},
				'select name' : () => 
									{
										this.nName.nativeElement.focus()
											selected = this.nName;
									},
				'select fields' : () => 
									{
										this.fieldsName.nativeElement.focus()
											selected = this.fieldsName;
									},
				'submit':()=>{
					
					this.addbtn._elementRef.nativeElement.click();
					
					//this.clearfn();
				},
				'clear all':()=>{
						this.clearbtn.nativeElement.click()
				},													
				'enter *data':(data)=>{
						selected.nativeElement.value = data;
				},
				'add *data':(data)=>{
						selected.nativeElement.value+='\n';
						selected.nativeElement.value+=data;
				},
				'set heading *data':(data)=>{
					this.headbtn.nativeElement.innerText = data;
				
				},
				'clear':()=>{
					selected.nativeElement.value="";
				} 
				

			};

			annyang.addCommands(commands);

      this.initializeVoiceRecognitionCallback();

			annyang.start({ autoRestart: false });
			console.log(this.voiceText)

		}
	}

	closeVoiceRecognition(): void {
    this.voiceActiveSectionDisabled = true;
		this.voiceActiveSectionError = false;
		this.voiceActiveSectionSuccess = false;
		this.voiceActiveSectionListening = false;
		this.voiceText = undefined;

		if(annyang){
      annyang.abort();
    }
	}
}
