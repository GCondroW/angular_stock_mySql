import { Component, Input, inject } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent{
	constructor(){
	
	}
	
	@Input() buttonLabel!:string;
	@Input() currentPage!:string;
	@Input() uploadHandler:any;//callback function
	
	
}