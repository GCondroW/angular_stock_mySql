import { Component,OnInit,inject } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../misc/upload/upload.component';
import { ColDef } from 'ag-grid-community';
import { XtService } from '../service/xt.service';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';

import { sheetModel } from './sheetModel';
import { localDbModel } from './localDbModel';

@Component({
  selector: 'app-xt',
  templateUrl: './xt.component.html',
  styleUrls: ['./xt.component.css']
})
export class XtComponent {
	private xtService:XtService=inject(XtService);
	public fileName:string="table_";
	public debugThis=()=>console.log(this);
	public gridData:Array<any>|null=null;
	public sheetModel:any={};
	public userName:any={};
	public tableCache:any={};
	private xtKey:any;
	private apiUrl:string="";
	public setUserName=()=>{
		let person = prompt();
		if (person != null) {
			alert(person)
			return this.userName.set(person);
		} 
	};
	public pUser=["guest42","utn5758"];
	public isP=()=>this.pUser.findIndex(x=>x==this.userName.value)+1;
	
	
	ngOnInit(){
		
		let url=()=>{
			if(location.hostname==="localhost")return "https://localhost:2125/xt/";
			if(location.hostname==="cwtest.biz.id")return "https://cwtest.biz.id:2125/xt/";
			return "https://cwtest.biz.id/xt/";
		};
		/*
		let userName=()=>{
			if(!localStorage.getItem(location.href)){
				localStorage.setItem(location.href,JSON.stringify({userName:'guest'}));
				let xt=JSON.parse(localStorage.getItem(location.href)!);
				return xt.userName;
			}else{
				let xt=JSON.parse(localStorage.getItem(location.href)!);
				return xt.userName;
			}
		};
		*/
		this.apiUrl=url();
		this.userName=new localDbModel(location.href,"userName");
		if(!this.userName.value)this.userName.set("Guest");
		this.xtKey=new localDbModel(location.href,"xtKey");
		this.tableCache=new localDbModel(location.href,"tableCache");
		//this.lUserName=new localDbModel("userName");
		
		this.updateKey(this.xtKey.value||"-1");
		this.xtService.req.get(this.apiUrl+"xtKey").subscribe((x:any)=>{
			let clientXtKey=this.xtKey.value;
			let serverXtKey=x.xtKey.toString();
			console.log("clientXtKey",clientXtKey,"serverXtKey",serverXtKey,clientXtKey===serverXtKey)
			if(clientXtKey===serverXtKey&&!!this.tableCache.value){
				let tableCache=JSON.parse(this.tableCache.value);
				this.sheetModel=new sheetModel(tableCache);
				this.siteNavigation.shownSheetName=this.sheetModel.sheetName[0];
				if(!this.siteNavigation.shownSheetName)this.siteNavigation.shownSheetName=this.sheetModel.sheetName[0]
				this.siteNavigation.changeSheet(this.siteNavigation.shownSheetName);	
			}else this.getTable();
		});
		
		console.log("this",this);
	};
	
	public getTableHeight = () =>{
		let windowHeigth=window.innerHeight;
		let navBarHeight=document.getElementById("mainNavbar")!.clientHeight;
		let offset=15;
		let tableHeight=windowHeigth-(navBarHeight+offset);
		this.tableHeight=tableHeight;
		return tableHeight;
	};
	public tableHeight:number=700;
	
	public colDefs:ColDef[]=[];
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		suppressMenu: false,
		suppressMovable:false,
		autoHeight: true,  
	};
	
	public gridOptions:any= {
		rowData:null,
		//suppressCellFocus:false,
		//pagination: true,
		//paginationAutoPageSize:true,	
		rowSelection: 'single',
		//paginationPageSize:50,	
		accentedSort:true,
		onGridReady:(params:any)=>{
			console.log("grid Event => onGridReady : ");
			addEventListener("resize", (event) => {
				this.getTableHeight();
			});
		},
		onFirstDataRendered:(event:any)=>{
			console.log("grid Event => onFirstDataRendered : ");
		},
		onSelectionChanged:(event: any)=>{

		},
		onCellEditingStarted:(event:any)=>{

		},
		onCellEditingStopped:(event:any)=>{

		},
		onPaginationChanged:(params:any)=>{
			//console.log("grid Event => onPaginationChanged : ");
		},
		onRowDataUpdated:async(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
		},
		onFilterChanged:(event:any)=>{
			//console.log("grid Event => onFilterChanged : ");
		},
		onColumnResized: (event:any) => {
			console.log("grid Event => onColumnResized : ");
			
		},
		onModelUpdated: (event:any)=>{
			//Displayed rows have changed. Triggered after sort, filter or tree expand / collapse events.
			console.log("grid Event => onModelUpdated : ");
			
		},
		onComponentStateChanged:(event:any)=>{
			console.log("grid Event => onComponentStateChanged : ");
			this.gridOptions.columnApi.autoSizeAllColumns()
		},
		onColumnVisible:(event:any)=>{
			console.log("grid Event => onColumnVisible : ",event);
		},
		onRowDoubleClicked:(event:any)=>{

		}
	};
	
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	private offCanvasInstance:any;
	public _offCanvas={
		open:(content:any)=>this.offCanvasInstance=this.offcanvasService.open(content),
	};
	
	public siteNavigation={
		shownSheetName:"",
		changeSheet:(sheetName:any)=>{
			let shownSheetName=sheetName;
			let header=this.sheetModel.sheetHeader[shownSheetName]||[];
			this.gridData=this.sheetModel.read(shownSheetName);
			this.colDefs=header.map((x:any)=>{return{field:x}})
		},
	};
	
	public getTable=()=>{
		this.xtService.req.get(this.apiUrl+this.fileName).subscribe((x:any)=>{
			if(x===null){
				alert ("tabel kosong");
				//this.gridData=[];
				this.updateTable([]);
				return
			};
			
			if (!!x.xtKey){
				//console.log("x.xtKey",x.xtKey.toString())
				//this.xtService.setHeader("xtKey",x.xtKey.toString());
				this.updateKey(x.xtKey.toString());
				this.getTable();
				return
			}
			
			this.updateTable(x);
		});
	};
		
	public updateTable = (data:Array<any>)=>{
		this.tableCache.set(JSON.stringify(data));
		console.log(data);
		this.sheetModel=new sheetModel(data);
		console.log("data = ",data,"sheetModel = ",this.sheetModel,"this.siteNavigation = ",this.siteNavigation);
		this.siteNavigation.shownSheetName=this.sheetModel.sheetName[0];
		if(!this.siteNavigation.shownSheetName)this.siteNavigation.shownSheetName=this.sheetModel.sheetName[0]
		this.siteNavigation.changeSheet(this.siteNavigation.shownSheetName);	
	}
	;	
	public updateKey=(key:string)=>{
		console.log("update xtKey : ",key);
		this.xtKey.set(key);
		this.xtService.setHeader("xtKey",key);
		
		//this.getTable();
	}
	
	public excel={
		upload:(dbName:string,data:any)=>{
			this.xtService.excelHandler.toJson(data).then(x=>{
				this.xtService.req.post(this.apiUrl+this.fileName,x).subscribe((x:any)=>{
					//alert(JSON.stringify(x.xtKey));
					//this.updateKey(x.xtKey.toString());
					this.tableCache.delete();
					this.getTable();
				})
			});	
		},
		download:(data:any,fileName:string)=>{
			this.xtService.excelHandler.toExcel(data,fileName)
		},
		delete:()=>{
			this.xtService.req.delete(this.apiUrl+this.fileName).subscribe((x:any)=>{
				console.log("delete",x);
				//this.updateKey(x.xtKey.toString());
				this.tableCache.delete();
				this.getTable();
			})
		}
	};
	
	public filter:any={
		searchTimeout:undefined,
		searchDelay:300,
		search:(event:any)=>{
			if(!!this.filter.searchTimeout)clearTimeout(this.filter.searchTimeout);
			this.filter.searchTimeout=setTimeout(()=>{
				this.gridOptions.api.paginationGoToFirstPage();
				this.gridOptions.api.setQuickFilter(event.target.value);
			},this.filter.searchDelay);	
		},
	};

}