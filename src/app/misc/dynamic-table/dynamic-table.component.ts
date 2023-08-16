import { Component,Input,SimpleChanges  } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']
})
export class DynamicTableComponent{

	constructor(){

	};
	
	ngOnInit(){
		this.data=this.dataPreProcessor(this.data);
		this.header=Object.keys(this.data[0]);
	}
	
  ngOnChanges(changes: SimpleChanges) {
	this.dataReProcessor();
  }
	
	public Object=Object;//enable the use of "Object" method inside angular component ex: looping an object	
	public header:Array<any>=[];
	public hiddenCollumn:any={};
	
	@Input() data?:Array<any>=[];
	@Input() defaultColumnDefs?:any={};

	dataReProcessor=()=>{
		return this.data=this.dataPreProcessor(this.data);
	}
	
	dataPreProcessor=(data:any)=>{
		console.log("data ", data);
		console.log("this.defaultColumnDefs ", this.defaultColumnDefs);
		let header=this.header;
		//let data=this.data;
		let defaultColumnDefs=this.defaultColumnDefs;
		let temp:Array<any>=[];
		
		data.map((dataItem:any)=>{
			let temp2:any={};
			Object.keys(dataItem).map((pointer:any)=>{
				if(!defaultColumnDefs[pointer])return temp2[pointer]=dataItem[pointer];
				if(!!defaultColumnDefs[pointer].callback){
					//console.log("defaultColumnDefs[pointer].callback()",defaultColumnDefs[pointer].callback());
					dataItem[pointer]=defaultColumnDefs[pointer].callback(dataItem[pointer]);
				};
				if(!!defaultColumnDefs[pointer].headerName){
					temp2[defaultColumnDefs[pointer].headerName]=dataItem[pointer];
				};
				if(!!defaultColumnDefs[pointer].hidden===true){
					this.hiddenCollumn[defaultColumnDefs[pointer].headerName]=true;
				};

				return
			})
			temp.push(temp2);
		})
		return temp;
	};
}
