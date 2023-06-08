import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GlobalVar } from '../../globalVar';
import { Router } from '@angular/router';
import { read, utils } from "xlsx";
import { GlobalErrorHandlerService } from '../../global-error-handler.service';

@Injectable({
  providedIn: 'root',
})

export class GlobalService {
	private http : HttpClient = inject(HttpClient);
	private router : Router = inject(Router);
	private url = GlobalVar.dbServerUrl;
	private globalErrorHandlerService: GlobalErrorHandlerService = inject(GlobalErrorHandlerService);
	constructor() { 

	}
	
	getCurrentUrl=()=>{
		//console.log('getCurrentUrl', this.router.routerState.snapshot.url);
		return this.router.routerState.snapshot.url;
	};
	
	getCurrentPage=()=>{
		return this.getCurrentUrl().split('/')[1];
	};
	
	getData=(dbName:string,id:number | undefined)=>{
		let url=this.url;
		let result:any;
		if(id===undefined){
			url=url+dbName;
		}else if(id>-1){
			url=url+dbName+"/"+id;
		}
		console.log(url);
		console.log(this.http.get(url));
		return this.http.get(url);
	};

	
	postData=(dbName:string,data:any={})=>{
		let url=this.url+dbName;
		return this.http.post(url,data)
	};
	
	wipeData=(dbName:string)=>{
		let url=this.url+dbName;
		return this.http.post(url,{});
	};
	
	deleteData=(dbName:string,id:number)=>{
		let url=this.url+dbName+"/"+id;
		return this.http.delete(url);
	};
	
	old_excelHandler=async(e:any)=>{
		let fileName=e.target.files[0].name;
		if(fileName.split(".")[1]!=="xlsx")throw this.globalErrorHandlerService.handleError(new Error("not_xlsx"));
		let file=e.target.files[0]
		let data=await file.arrayBuffer();
		let workBook=read(data);
		
		
		const temp: {[index: string]:any} = {};
		
		workBook.SheetNames.map((sheetName:any)=>{
			temp[sheetName]=utils.sheet_to_json(workBook.Sheets[sheetName]);
			
		});
		let excelData={[fileName]:temp};
		
		return excelData;
	};
	
	excelHandler=async(e:any)=>{
		let fileName=e.target.files[0].name;
		if(fileName.split(".")[1]!=="xlsx")throw this.globalErrorHandlerService.handleError(new Error("not_xlsx"));
		let file=e.target.files[0]
		let data=await file.arrayBuffer();
		let workBook=read(data);
		let sheetName=workBook.SheetNames[0];
		
		
		
		let temp: {[index: string]:any} = {};
		
		workBook.SheetNames.map((sheetName:any)=>{
			temp[sheetName]=utils.sheet_to_json(workBook.Sheets[sheetName]);
			
		});
		let excelData={[fileName]:temp};
		
		
		temp=utils.sheet_to_json(workBook.Sheets[sheetName]);
		return temp;
	};
}