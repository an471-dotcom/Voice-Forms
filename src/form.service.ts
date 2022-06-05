import { Injectable } from '@angular/core';
import {FormPreview} from './app/create/create.component'
@Injectable({
  providedIn: 'root'
})
export class FormService {
  public formelements:any;
  constructor() { }
  setvalue(data:any):void{
    this.formelements = data;
  }
  getvalue():any{
    return this.formelements;
  }
}
