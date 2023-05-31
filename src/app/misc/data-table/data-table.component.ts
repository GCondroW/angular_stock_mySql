import { Component, Input, inject, OnInit, ViewChild  } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { CellClickedEvent, ColDef, GridReadyEvent } from 'ag-grid-community';

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
		this.tableCollumn=this.getTableCollumn(this.data);
		this.processedData=this.data[this.docName][this.sheetName];
		this.collumnDefs=this.tableData.getColumnDefs();
		console.log(this.tableData.getColumnDefs());
	};
	
	constructor(){

	}
	
	testVar:any;
	@Input() data:any;
	@ViewChild(AgGridAngular) agGrid!: AgGridAngular;
	
	docName:any;
	sheetName:any;
	tableCollumn:any;
	processedData:any;
	collumnDefs:ColDef[]=[];
	
	public defaultColDef: ColDef = {
		sortable: true,
		filter: false,
		editable:true,
	};
	
	private tableData:any={
		getColumnDefs:()=>{
			let tableCollumn=this.tableCollumn;
			let temp:ColDef[];
			temp=[];
			tableCollumn.map((item:string)=>{
				temp.push({field:item})
			});
			console.log(temp);
			console.log(typeof(temp));
			return temp;
		}
	};
	
	getTableCollumn=(data:any)=>{
		let docName=this.docName;
		let sheetName=this.sheetName;
		return Object.keys(data[docName][sheetName][0]);
	};
	
	getWholeData=(data:any)=>{
		//console.log("log :");
		return JSON.stringify(data,null,1);
	};
}
