import { Component, inject } from '@angular/core';
import { GlobalErrorHandlerService } from '../../global-error-handler.service';
import { read, utils } from "xlsx";
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent{
	constructor(){
		
	}
	globalErrorHandlerService: GlobalErrorHandlerService = inject(GlobalErrorHandlerService);
	http: HttpClient = inject(HttpClient);
	uploadHandler=async(e:any)=>{
		let fileName=e.target.files[0].name;
		console.log(e.target);
		if(fileName.split(".")[1]!=="xlsx")throw this.globalErrorHandlerService.handleError(new Error("not_xlsx"));
		let file=e.target.files[0]
		let data=await file.arrayBuffer();
		let workBook=read(data);
		console.log(workBook);
		const temp: {[index: string]:any} = {};
		
		workBook.SheetNames.map((sheetName:any)=>{
			console.log('workBook',workBook)
			temp[sheetName]=utils.sheet_to_json(workBook.Sheets[sheetName]);
			
		});
		let excelData={[fileName]:temp};
		
		const result: {[index: string]:any} = {};
		
		await this.http.post<any>('http://127.0.0.1:3000/excelDb', excelData).subscribe(x=>{
			//this.fetchedData=x;
			//console.log(this.fetchedData);
		})
	}
}