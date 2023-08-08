import { Component,OnInit,inject, Input } from '@angular/core';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { UploadComponent } from '../misc/upload/upload.component';
import { DataTableComponent } from '../misc/data-table/data-table.component';
import { GlobalService } from '../service/global/global.service';
import { GlobalVar } from '../globalVar'
import { DynamicTableComponent } from '../misc/dynamic-table/dynamic-table.component';
import { ColDef } from 'ag-grid-community';
import { Socket } from 'ngx-socket-io';


@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css']
})
export class StockComponent {
	private globalService:GlobalService=inject(GlobalService);
	private dbKey=GlobalVar.dbKey;
	public socket:Socket=inject(Socket);
	public currentPage=this.globalService.getCurrentPage();
	public downloadExcel = this.globalService.downloadExcel;
	public JSON=JSON;
	public Object=Object;
	public console=console;
	public data=new GlobalVar.stockData([])
	public dataIsReady:Boolean=false;
	public navigationPages:any;
	constructor(){
		this.navigationPages=GlobalVar.pages;
		
	};
	ngOnInit(){
		this.socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
		this.socket.on("__1", (arg1:any) => {
			console.log("__1",arg1); // 1
			this.get(this.currentPage);
		});
		console.log(this);
		
	};
	
	/// OFFCANVAS ///
	private offcanvasService:NgbOffcanvas=inject(NgbOffcanvas);
	public _offCanvas={
		open:(content:any)=>this.offcanvasService.open(content),
	};
	/// \OFFCANVAS ///
	
	/// EXCEL ///
	public _excel={
		postExcel:(dbName:string,data:any)=>{
			this.globalService.wipeData(dbName).subscribe(x=>{
				this.globalService.excelHandler(data).then(x=>{
					console.log("Excel : ", x)
					this.rw(()=>this.globalService.postData(dbName,x));
				});
			});				
		},
		downloadExcel:this.globalService.downloadExcel,
	};
	/// \EXCEL ///
	
	/// AG-GRID ///
	
	public defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: true,
		editable:false,
	};	
	
	public filter:any={
		defaultFilterParam:{
			supplier:{
				filterType: 'text',
				type:'contains',
				filter:"",
			},
			kategori:{
				filterType: 'text',
				type:'contains',
				filter:"PAJAK",
			},
			ctn:{
				filterType: 'number',
				type:'greaterThanOrEqual',
				filter:1,
			},
			"Qty/ Ctn":{
				filterType: 'text',
				type:'contains',
				filter:"",
			},
		},
		getCurrentFilter:()=>this.gridApi.getFilterModel(),
		setFilter:(header:any,filter:any,filterType?:string,type?:string)=>{
			let filterInstance = this.gridApi.getFilterInstance(header); 
			let defaultFilterParam=this.filter.defaultFilterParam;
			let temp1:any={};
			temp1['filter']=filter;
			if(!filterType){
				if(filterInstance.filterType) return temp1['filterType']=filterInstance.filterType;
				temp1['filterType']=defaultFilterParam[header].filterType;
			} else {
				temp1['filterType']=filterType;
			};
			if(!type){
				if(filterInstance.type) return temp1['type']=filterInstance.type;
				temp1['type']=defaultFilterParam[header].type;
			} else {
				temp1['type']=type;
			};
			filterInstance.setModel(temp1);
			this.gridApi.onFilterChanged();
			console.log(" temp : ",temp1)
			console.log(" GRIDAPI : ",this.gridApi)
			
		},
		setFilterOld:(header:any,filter:any,filterType?:string,type?:string)=>{
			let temp=this.filter.getCurrentFilter();
			console.log('filterEval 1 : ',header,type)
			
			//if(!filter)filter=this.filter.defaultFilterParam[header].filter;
			if(!filterType)filterType=this.filter.defaultFilterParam[header].filterType;
			if(!type)type=this.filter.defaultFilterParam[header].type;
			
			console.log('filterEval 2 : ',header,type)
			Object.assign(temp[header],{
				filter:filter,
				filterType:filterType,
				type:type,
				
			});
			this.gridApi.setFilterModel(temp);
			console.log(" temp : ",temp)
			console.log(" GRIDAPI : ",this.gridApi)
		},
	};
	
	
	public gridOptions:any= {
		columnDefs:[],
		pagination: true,
		paginationAutoPageSize:true,
		rowSelection: 'single',
		onRowClicked: ()=>alert("ERR"),
		onGridReady:(params:any)=>{
			
			console.log("grid Event => onGridReady : ");
			this.gridApi=this.gridOptions.api;
			this.gridApi.setFilterModel(this.filter.defaultFilterParam);
			console.log(this.gridApi.getFilterModel(),this.filter.defaultFilterParam);
			

		},
		onCellEditingStarted:(event:any)=>{
			console.log("grid Event => onCellEditingStarted : ");

		},
		onCellEditingStopped:(event:any)=>{
			console.log("grid Event => onCellEditingStopped : ");

		},
		onPaginationChanged:(params:any)=>{
			if(!params.newPage)return
			console.log("grid Event => paginationChanged : ");
		//	this.adjustTableContainerSize();
			this.adjustTableContainerSize()
		


		},
		onRowDataUpdated:(event:any)=>{
			console.log("grid Event => onRowDataUpdated : ");
			this.adjustTableContainerSize();

		},
		onColumnResized: (event:any) => {
			console.log("grid Event => onColumnResized : ");
			
			//this.adjustTableContainerSize()
		},
	};
	public gridApi:any;//initialize at gridOptions.onGridReady
	public tableContainerStyle:any={};
	public adjustTableContainerSize=()=>{
			this.gridOptions.columnApi.autoSizeAllColumns();
		console.log("dataTable event => this.adjustContainerSize()");
		let navbarHeight=document.getElementById("navbarId")?.clientHeight;
		if(navbarHeight===undefined)navbarHeight=0;
		////////////////////////////////////////////
		let container=document.getElementById("gridTable")!;
		let containerRect=container.getBoundingClientRect();
		let containerRectTop=containerRect.top;
		////////////////////////////////////////////
		let innerTable=document.querySelectorAll('[Class=ag-center-cols-container]')[0];
		let innerTableRect=innerTable?.getBoundingClientRect();
		let innerTableRectRight:number=0;;
		if(!!innerTableRect?.right)innerTableRectRight=innerTableRect.right;
		/////////////////////////////////////////////
		let scrollBar=document.querySelectorAll('[Class=ag-body-vertical-scroll-viewport]')[0];
		let scrollBarRect=scrollBar?.getBoundingClientRect();
		let scrollBarRectWidth=scrollBarRect?.width;
		//////////////////////////////////////////////
		if(!!innerTable){
			let innerTableWidth=innerTable.getBoundingClientRect().width;
			let windowWidth=window.innerWidth;
			let width="30%";
			let height="100%";
			if(innerTableWidth>=windowWidth)width="auto";
			else{
				width=(innerTableRectRight+scrollBarRectWidth)+"px";
			}
			let marginBottom:number=-5;
			height=(window.innerHeight-containerRectTop+window.scrollY)+marginBottom-navbarHeight+"px";
			this.tableContainerStyle={
				width:width,
				height:height,
			};
		};
		
		
	};
	/// \AG-GRID ///
	
	rw=(request:any)=>{
		console.log("Request",request);
		return request().subscribe((x:any)=>{
			if (!!x.ERR) return alert(x.ERR.message);
			if (!!x.dbKey){
				let dbKey=x.dbKey.toString();
				this.getDbKey(dbKey)
				return this.rw(()=>request());
			}else this.updateData(x);
		});
	};
	getDbKey=(dbKey:string)=>{
		console.log("dbKey : ",dbKey )
		GlobalVar.dbKey=dbKey;
		alert ("set db key "+JSON.stringify(GlobalVar.dbKey));
		this.globalService.setHeaders("dbKey",dbKey);
	};
	get=(page:string)=>{
		return this.rw(()=>this.globalService.getData(page));
	};
	public updateData=(x:any)=>{
		let returnVal=this.data.set(x);
		let gridOptionCallback=()=>this.gridOptions.columnDefs=this.data.list.colDef;
		gridOptionCallback();
		return returnVal;
	};
	public refresh=()=>{
		console.log('refreshPlaceHolder');
	};
	public misc={

	};
}
