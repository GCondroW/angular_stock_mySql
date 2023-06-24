import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
	private url = GlobalVar.dbServerUrl;
	private globalErrorHandlerService: GlobalErrorHandlerService = inject(GlobalErrorHandlerService);
	private modalService:NgbModal=inject(NgbModal);
	constructor() { 

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
		}else{
			url=url+dbName+"/"+id;
		}
		return this.http.get(url);
	};

	
	postData=(dbName:string,data:any={})=>{
		let url=this.url+dbName;
		return this.http.post(url,data)
	};
	
	putData=(dbName:string,id:number,data:any={})=>{
		let url=this.url+dbName+"/"+id;
		return this.http.put(url,data);
	};
	
	wipeData=(dbName:string)=>{
		let url=this.url+dbName;
		console.log("wipeData",url);
		let data:any=[];
		return this.http.delete(url);
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
			temp[sheetName]=utils.sheet_to_json(workBook.Sheets[sheetName]);
			
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