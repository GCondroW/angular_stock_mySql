import { Component, inject } from '@angular/core';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css',]
})

export class ImportComponent {
	private globalService: GlobalService = inject(GlobalService);
	private globalVar = GlobalVar;
	private consoleDump = GlobalVar.consoleDump;
	constructor(){
		this.currentPage=this.globalService.getCurrentPage();
		this.message=this.globalVar.import.message;
		this.navInit();
		this.refresh();
	};
	public message:any;
	public currentPage:string;//current page / database used => import
	public isLoaded:boolean=false;//loading placeholder
	public dataIsNotEmpty:boolean=false;//empty data placeholder
	public selectedDataId:number | null=null;//self explanatory, for 'precision usage'
	private selectedRowId:number | null=null;//self explanatory, for 'precision usage'
	private updateDataOld:any;
	private updateDataNew:any;
	private tableColumn:Array<any>=this.globalVar.import.tableColumn;
	
	public testFunc=()=>{
		this.consoleDump([
			["navStates",this.navStates],
			["activeNav",this.activeNav],
		])
	}
	
	/// NAV HANDLER ///
	private navInit=()=>{
		this.navStates.map(item=>{
			if(item.default===true) return this.activeNav=item.name;
			return
		})
	}
	public activeNav:any;
	public navStates:Array<any>=[
		{
			default:true,
			name:"View",
			funct:()=>{
				this.defaultColDef={
					resizable:true,
					sortable: true,
					filter: true,
					editable:false,
				};
				this.activeNav="View";
			},
		},
		{
			name:"Edit",
			funct:()=>{
				this.defaultColDef={
					resizable:true,
					sortable: true,
					filter: true,
					editable:true,
				};
				this.activeNav="Edit";
			},
		},
		{
			name:"Transaction",
			funct:()=>{
				this.defaultColDef={
					resizable:true,
					sortable: true,
					filter: true,
					editable:true,
				};
				this.activeNav="Transaction";
			},
		},
	];
	/// NAV HANDLER ///
	
	/// ag-grid handler ///
	public gridApi:any;
	public gridColumnApi:any;
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		editable:false,
	};
	private getColumnDefs=(data:any)=>{
		let tableColumn=Object.keys(data[0]);
		let temp:ColDef[];
		temp=[];
		tableColumn.map((item:string)=>temp.push({field:item}));
		return temp;
	};
	public gridOptions:any= {
		columnDefs: [],
		pagination: true,
		rowSelection: 'single',
		onRowClicked: (event:any) => {
			console.log("row clicked",event),
			this.selectedDataId=(event.data.id);
			this.selectedRowId=event.api.getFocusedCell().rowIndex;
		},
		onCellEditingStarted:(event:any)=>{
			console.log("cell editing...","id = ",event.data.id);
			let data=JSON.parse(JSON.stringify(event.data));//create new persistence instance of 'data' instead of Object reference
			this.updateDataOld=data;
			console.log("updateDataOld",this.updateDataOld)
		},
		onCellEditingStopped:(event:any)=>{
			let data=event.data;
			let id=data.id;
			this.updateDataNew=data;
			if(JSON.stringify(this.updateDataOld)===JSON.stringify(data))return
			this.update(this.currentPage,id,data);
			console.log("cell edited","id = ",id,"new data = ",data)
			
		},
		onColumnResized: (event:any) => {},
	};
	public rowData:Array<any>=[];
	/// ag-grid handler ///
	
	/// excel handler ///
	private docName:any;
	private sheetName:any;
	//private tableColumn:any;
	private processedData:any;
	private dataPreProcessing=(excelData:any)=>{
		let docName=Object.keys(excelData)[0];
		let sheetName=Object.keys(excelData[docName])[0];
		//let tableColumn=Object.keys(excelData[docName][sheetName][0]);
		let processedData=excelData[docName][sheetName];
		
		this.docName=docName;
		this.sheetName=sheetName;
		//this.tableColumn=tableColumn;
		this.processedData=processedData;
		return this.processedData;
	};
	/// excel handler ///
	
	/// MAIN ///
	refresh=()=>{
		this.get(this.currentPage);
	};
	updateTable=(data:any)=>{
		this.dataIsNotEmpty=false;
		let dataIsEmpty=!!(Object.keys(data).length<1||data===null);
		let dataIsObject=!(data.length);
		if(dataIsObject)data=[data];
		if(dataIsEmpty){
			this.isLoaded=true;	
			return
		}else{
			this.dataIsNotEmpty=true;
			this.isLoaded=true;		
			this.rowData=data;	
			this.gridOptions.columnDefs=this.getColumnDefs(data);	
			return data;
		};
	};
	get=(page:string)=>{
		this.isLoaded=false;	
		return this.globalService.getData(page,undefined).subscribe(x=>this.updateTable(x));
	};
	post=(page:string,data:any)=>{
		this.isLoaded=false;	
		console.log("page",page);
		console.log("data",data);
		this.globalService.excelHandler(data,this.tableColumn).then(x=>{
			console.log(x);
			this.globalService.postData(page,x).subscribe(x=>{
				this.updateTable(x);
			})
		})
	};
	precisionDelete=(id:number)=>{
		this.isLoaded=false;	
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
		this.isLoaded=false;	
		let temp=confirm("delete ALL : "+page+" ?");
		/*
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			this.updateTable(x);
		})*/
		
		if(temp===true)return this.globalService.wipeData(page).subscribe(x=>{
			this.updateTable(x);
		})
		
		return
	};
	update=(page:string,id:number,data:any={})=>{
		let oldData = this.updateDataOld;
		let newData = this.updateDataNew;
		let rowNode=this.gridOptions.api.getRowNode(this.selectedRowId);
		let temp=confirm("update : "+JSON.stringify(oldData)+" => "+JSON.stringify(newData));
		if(temp===true){
			this.globalService.putData(page,id,data).subscribe(x=>{
				let data:any=x;
				rowNode.setData(data);
				return
			});
		}else {
			rowNode.setData(oldData);
		}
	};
}
