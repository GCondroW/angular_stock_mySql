import { Component, Input, inject } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent{
	constructor(){
	}
	toggleValue=false;
	toggleUploadField=()=>this.toggleValue=!this.toggleValue;
	@Input() currentPage!:string;
	@Input() uploadHandler:any;//callback function
	
	
}