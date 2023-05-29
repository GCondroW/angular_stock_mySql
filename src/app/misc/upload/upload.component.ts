import { Component, Input } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
//import { Router } from '@angular/router';
//import { GlobalService } from '../../service/global/global.service';
//import { GlobalVar } from '../../globalVar';

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

	@Input() uploadHandler:any;
	
	/*uploadHandler=async(e:any)=>{
		const result: {[index: string]:any} = {};
		//let url=GlobalVar.dbServerUrl;
		let dbName=this.globalService.getCurrentPage();
		console.log(dbName);
		await this.globalService.postData(dbName,excelData).subscribe(x=>{
			this.router.navigate(['/'+dbName])
		});
	}*/
}