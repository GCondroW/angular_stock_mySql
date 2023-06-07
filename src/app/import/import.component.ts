import { Component, inject } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css',]
})

export class ImportComponent {
	private globalService: GlobalService = inject(GlobalService);
	
	public currentPage:string;
	public jsonData:any;
	public isLoaded:boolean=false;
	//public datafinalObject = new BehaviorSubject(null);
	
	constructor(){
		this.currentPage=this.globalService.getCurrentPage();
		this.refresh();
	};
	
	private docName:any;
	private sheetName:any;
	private tableColumn:any;
	private processedData:any;
	
	dataPreProcessing=(excelData:any)=>{
		let docName=Object.keys(excelData)[0];
		let sheetName=Object.keys(excelData[docName])[0];
		let tableColumn=Object.keys(excelData[docName][sheetName][0]);
		let processedData=excelData[docName][sheetName];
		
		this.docName=docName;
		this.sheetName=sheetName;
		this.tableColumn=tableColumn;
		this.processedData=processedData;
		return this.processedData;
	};
	refresh=()=>{
		this.get(this.currentPage);
	};
	updateTable=(data:any)=>{
		console.log("data",data);
		let dataIsEmpty=!!(Object.keys(data).length<1);
		if(dataIsEmpty){
			this.jsonData=null;
			return this.jsonData;
		}else{
			this.isLoaded=true;		
			this.jsonData=data;	
			return data;
		};
	};
	get=(page:string)=>{
		return this.globalService.getData(page,undefined).subscribe(x=>this.updateTable(x));
	};
	post=(page:string,data:any)=>{
		console.log("page",page);
		console.log("data",data);
		this.globalService.excelHandler(data).then(x=>{
			console.log(x);
			this.globalService.postData(page,x).subscribe(x=>{
				this.updateTable(x);
			})
		})
	};
	precisionDelete=(id:number)=>{
		console.log(id);
		let page=this.currentPage;
		
		let temp=confirm("delete : "+id+" ?");
		if(temp===true)return this.globalService.getData(page,id).subscribe(x=>{
			this.updateTable(x);
		})
		return
	};
	precissionGet=(id:number)=>{
		
	};
	deleteAll=(page:string)=>{
		let temp=confirm("delete ALL : "+page+" ?");
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			this.updateTable(x);
		})
		return
	};
	put=()=>{
	
	};

}
