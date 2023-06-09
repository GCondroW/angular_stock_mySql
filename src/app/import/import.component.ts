import { Component, inject } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { ColDef, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css',]
})

export class ImportComponent {
	private globalService: GlobalService = inject(GlobalService);
	constructor(){
		this.currentPage=this.globalService.getCurrentPage();
		this.refresh();
	};
	public currentPage:string;//current page / database used => import
	public isLoaded:boolean=false;//loading placeholder
	public selectedRowId:number | null=null;//self explanatory, for 'precision usage'
	
	/// ag-grid handler ///
	private defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: false,
		editable:false,
	};
	private getColumnDefs=(data:any)=>{
		let tableColumn=Object.keys(data[0]);
		let temp:ColDef[];
		temp=[];
		tableColumn.map((item:string)=>temp.push({field:item}));
		return temp;
	}
	public gridOptions:any= {
		columnDefs: Array<any>,
		pagination: true,
		rowSelection: 'single',
		defaultColDef: this.defaultColDef,
		onRowClicked: (event:any) => {this.selectedRowId=(event.data.id);},
		onColumnResized: (event:any) => {},
	};
	public rowData:Array<any>=[];
	/// ag-grid handler ///
	
	/// excel handler ///
	private docName:any;
	private sheetName:any;
	private tableColumn:any;
	private processedData:any;
	private dataPreProcessing=(excelData:any)=>{
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
	/// excel handler ///
	
	refresh=()=>{
		this.get(this.currentPage);
	};
	updateTable=(data:any)=>{
		let dataIsEmpty=!!(Object.keys(data).length<1||data===null);
		let dataIsObject=!(data.length);
		if(dataIsObject)data=[data];
		if(dataIsEmpty){
			this.rowData=[];
			return
		}else{
			this.isLoaded=true;		
			this.rowData=data;	
			this.gridOptions.columnDefs=this.getColumnDefs(data);	
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
		if(temp===true)return this.globalService.deleteData(page,id).subscribe(x=>{
			this.refresh();
		})
		return
	};
	precissionGet=(id:number)=>{
		
	};
	deleteAll=(page:string)=>{
		let temp=confirm("delete ALL : "+page+" ?");
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			console.log(x);
			this.updateTable(x);
		})
		return
	};
	put=()=>{
	
	};

}
