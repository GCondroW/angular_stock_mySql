import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GlobalVar } from '../../globalVar';
import { Router } from '@angular/router';
import { read, utils, writeFile } from "xlsx";
import { GlobalErrorHandlerService } from '../../global-error-handler.service';
import { DynamicModalComponent } from '../../misc/dynamic-modal/dynamic-modal.component';
import { LowSync } from 'lowdb'
import { JSONFileSync } from 'lowdb/node'

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root',
})

export class GlobalService {
	private http : HttpClient = inject(HttpClient);
	private router : Router = inject(Router);
	//private dynamicModalComponent = inject(DynamicModalComponent);

	private globalErrorHandlerService: GlobalErrorHandlerService = inject(GlobalErrorHandlerService);
	private modalService:NgbModal=inject(NgbModal);
	
	private url = GlobalVar.dbServerUrl;
	private dbKey = GlobalVar.dbKey;
	private headers=new HttpHeaders();
	
	constructor() { 
		 this.setHeaders('dbKey', this.dbKey.toString());
		 console.log(this)
	}
	
	_modal={
		createModal:(content:any)=>{
			
			console.log(content);
			let closeResult:any;
			let template ="";
			let temp=document.createElement('ng-template');
			//temp.innerHTML=template;
			this.modalService.open(DynamicModalComponent, { ariaLabelledBy: 'modal-basic-title' }).result.then(
				(result) => {
					closeResult = `Closed with: ${result}`;
				},
				(reason) => {
					//closeResult = `Dismissed ${this.getDismissReason(reason)}`;
				},
			);
		}
	};
	
	setHeaders=(key:string,value:string)=>{
		 this.headers=this.headers.set(key,value);
		 console.log('header set ', this.headers);
	};
	
	getCurrentUrl=()=>{
		//console.log('getCurrentUrl', this.router.routerState.snapshot.url);
		return this.router.routerState.snapshot.url;
	};
	
	getCurrentPage=()=>{
		return this.getCurrentUrl().split('/')[1];
	};
	
	getData=(dbName:string,id?:number | undefined)=>{
		let url=this.url;
		let result:any;
		if(id===undefined){
			url=url+dbName;
		}else{
			url=url+dbName+"/"+id;
		}
		return this.http.get(url,{headers:this.headers});
	};

	
	postData=(dbName:string,data:any={})=>{
		let url=this.url+dbName;
		return this.http.post(url,data,{headers:this.headers})
	};
	
	postEmbedData=(dbName:string,data:any={},embedName:string|undefined,id:string|undefined)=>{
		let url=this.url+dbName+"/"+embedName+"/"+id;
		return this.http.post<any>(url,data,{headers:this.headers})
	};
	
	putData=(dbName:string,id:number,data:any={})=>{
		let url=this.url+dbName+"/"+id;
		return this.http.put(url,data);
	};
	
	wipeData=(dbName:string)=>{
		let url=this.url+dbName;
		console.log("wipeData",url);
		let data:any=[];
		return this.http.delete(url,{headers:this.headers});
	};
	
	deleteData=(dbName:string,id:number)=>{
		let url=this.url+dbName+"/"+id;
		return this.http.delete(url);
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
			temp[sheetName]=utils.sheet_to_json(workBook.Sheets[sheetName],{blankrows:true,defval:""});
			
		});
		return temp[sheetName];
	};
	
	downloadExcel=(dbName:string)=>{
		
		this.getData(dbName,undefined).subscribe((x:any)=>{
			GlobalVar.consoleDump([
				["utils",utils],
				["downloadData",x]
			]);
			let dataSheet=utils.json_to_sheet(x);
			let wb = utils.book_new();
			utils.book_append_sheet(wb,dataSheet , dbName);
			writeFile(wb, dbName+".xlsx", { compression: true });
		});
	}
}