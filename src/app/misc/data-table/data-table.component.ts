import { Component, Input, inject, OnInit  } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
	ngOnInit(){
		console.log(this);
		window.addEventListener('resize',()=>this.adjustContainerSize(), true);
		this.gridOptions.onGridReady=(params:any) => {
			console.log('The grid is now ready'),
			this.api = params.api;
			this.columnApi = params.columnApi;
			//this.api.rowModel.setRowData(this.data);
			//this.api.redrawRows();
			this.columnApi.autoSizeAllColumns();
			this.adjustContainerSize();
		};
		//console.log("container.offsetTop",document.getElementById("gridTable").offsetTop);
	};
	
	constructor(){


	}
	
	@Input() rowData:Array<any>=[];
	@Input() gridOptions:GridOptions<any>={};
	@Input() deleteHandler:any;
	@Input() selectedRowId:number | null=null;
	
	private api:any;
	private columnApi:any;
	private collumnDefs:ColDef[]=[];

	
	deleteData : any=null;
	//public gridOptions!:GridOptions;
	public containerStyle:any={};
	
	
	private adjustContainerSize=()=>{
		let container=document.getElementById("gridTable")!;
		let containerRect=container.getBoundingClientRect();
		let containerRectTop=containerRect.top;
		////////////////////////////////////////////
		let innerTable=document.querySelectorAll('[Class=ag-center-cols-container]')[0];
		let innerTableRect=innerTable.getBoundingClientRect();
		let innerTableRectRight=innerTableRect.right;
		/////////////////////////////////////////////
		let scrollBar=document.querySelectorAll('[Class=ag-body-vertical-scroll-viewport]')[0];
		let scrollBarRect=scrollBar.getBoundingClientRect();
		let scrollBarRectWidth=scrollBarRect.width;
		//////////////////////////////////////////////
		let innerTableWidth=innerTable.getBoundingClientRect().width;
		let windowWidth=window.innerWidth;
		let width="100%";
		let height="100%";
		if(innerTableWidth>=windowWidth)width="auto";
		else{
			width=(innerTableRectRight+scrollBarRectWidth)+"px";
		}
		let marginBottom:number=-5;
		height=(window.innerHeight-containerRectTop+window.scrollY)+marginBottom+"px";
		this.containerStyle={
			width:width,
			height:height,
		};
	};
}
