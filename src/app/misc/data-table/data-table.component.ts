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
		this.docName=Object.keys(this.data)[0];
		this.sheetName=Object.keys(this.data[this.docName])[0];
		this.tableColumn=this.getTableColumn(this.data);
		this.processedData=this.data[this.docName][this.sheetName];
		//this.collumnDefs=this.tableData.getColumnDefs();

		this.gridOptions= {
			columnDefs: this.tableData.getColumnDefs(),
			pagination: true,
			rowSelection: 'single',
			defaultColDef: this.defaultColDef,
			onGridReady : (params:any) => {
				console.log('The grid is now ready'),
				this.api = params.api;
				this.columnApi = params.columnApi;
				this.api.rowModel.setRowData(this.processedData);
				console.log(this.api);
				this.api.redrawRows();
				this.columnApi.autoSizeAllColumns();
				this.adjustContainerSize();
			},
			onRowClicked: event => console.log('A row was clicked'),
			onColumnResized: event => {
				console.log('A column was resized');
				this.adjustContainerSize();
			},
			getRowHeight: (params) => 25
		};
		window.addEventListener('resize',()=>this.adjustContainerSize(), true);
		//console.log("container.offsetTop",document.getElementById("gridTable").offsetTop);
		
	};
	
	constructor(){


	}
	
	@Input() data:any;
	
	private docName:any;
	private sheetName:any;
	private tableColumn:any;
	private processedData:any;
	private api:any;
	private columnApi:any;
	private collumnDefs:ColDef[]=[];
	private defaultColDef: ColDef = {
		resizable:true,
		sortable: true,
		filter: false,
		editable:true,
	};
	
	public gridOptions!:GridOptions;
	public containerStyle:any={};
	
	aGridTest=()=>{
		console.log(this.api.deselectAll());
	}
	
	private tableData:any={
		getColumnDefs:()=>{
			let tableColumn=this.tableColumn;
			let temp:ColDef[];
			temp=[];
			tableColumn.map((item:string)=>{
				temp.push({field:item})
			});
			return temp;
		}
	};
	
	private getTableColumn=(data:any)=>{
		let docName=this.docName;
		let sheetName=this.sheetName;
		return Object.keys(data[docName][sheetName][0]);
	};
	
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
		height=(window.innerHeight-containerRectTop+window.scrollY)+"px";
		this.containerStyle={
			width:width,
			height:height,
		};
	};
	
	
}
