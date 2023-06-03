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
			onColumnResized: event => console.log('A column was resized'),
			getRowHeight: (params) => 25
		};
			
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
		
		console.log(document);
		console.log(window);
		console.log()
		this.containerStyle={
			width:"100%",
			height:"100%"
		};
	};
	
	
}
