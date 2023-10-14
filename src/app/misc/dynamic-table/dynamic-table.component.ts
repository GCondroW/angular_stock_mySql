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
	}
	
	ngOnChanges(changes: SimpleChanges) {
		this.data=this.dataPreProcessor(this.data);
	}
	
	public Object=Object;//enable the use of "Object" method inside angular component ex: looping an object	
	public header:Array<any>=[];
	public hiddenCollumn:any={};
	
	@Input() data?:Array<any>=[];
	@Input() defaultColumnDefs?:any={};
	
	dataPreProcessor=(data:any)=>{
		
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
		console.log(temp)
		if(!!temp[0])this.header=Object.keys(temp[0]);
		
		return temp;
	};
}
