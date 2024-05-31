export class sheetModel{
	public rawData:any={};
	public sheetHeader:any={};
	public sheetName:Array<any>=[];
	constructor(rawData:any){
		this.rawData=rawData;
		this.sheetName=Object.keys(rawData);
		this.sheetHeader=this.getSheetHeader();
		console.log(this);
	}
	private getSheetHeader=()=>{
		let returnVar={};
		this.sheetName.map(x=>{
			Object.assign(returnVar,{[x]:Object.keys(this.rawData[x][0])})
		})
		return returnVar;
	};
	
	private isNumber=(value:any)=>{
		return typeof value === 'number' && isFinite(value);
	}
	
	public read=(sheetName:any)=>{
		if(this.isNumber(sheetName))sheetName=this.sheetName[sheetName];
		if(!this.sheetName.find(x=>x===sheetName))sheetName=sheetName=this.sheetName[0];
		return this.rawData[sheetName]
	};
};