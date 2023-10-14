import { Component, Input, inject, OnInit  } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { GridOptions } from 'ag-grid-community';
import { DynamicModalComponent } from '../dynamic-modal/dynamic-modal.component';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {
	ngOnInit(){
		//window.addEventListener('resize',()=>this.adjustContainerSize(), true);
		console.log(this);
	};
	constructor(){
	}
	@Input() rowData:Array<any>|null=null;
	@Input() gridOptions:GridOptions<any>={};
	@Input() defaultColDef:any;
	//@Input() rowHeight:number=0;
	//@Input() headerHeight:number=0;
	@Input() testFunct:any;
	@Input() overlayLoadingTemplate?:any|null;
	@Input() overlayNoRowsTemplate?:any;			
				
	public modalIsActive=false;
}
