import { ColDef } from 'ag-grid-community';
export const GlobalVar = {
	dbKey:"",
	excelDb:{
		data:{},
		sheetNames:{},
		tableNames:{},
	},
	pages:{},
	stockData:class stockData{
		raw:Array<any>=[];
		list:{data:any,colDef:any}={
			data:[],
			colDef:[],
			
		};
		constructor(data:Array<any>){
			this.raw=data;
		};
		length=this.raw.length;
		set=(data:Array<any>)=>{
			this.raw=data;
			this.createView.list(data);

		};
		get=()=>this.raw;
		createView={
			list:(data:any)=>{
				let getColumnDefs=(data:any)=>{
					let tableColumn=Object.keys(data[0]);
					let temp:ColDef[];
					temp=[];
					tableColumn.map((item:string)=>{
						let pushVar:any={};
						if(item==="_id")pushVar["hide"]=true;//hiding _id column
						if(item==="Ctn")pushVar["editable"]=false;
						//pushVar["filter"]='agSetColumnFilter';		
						pushVar["autoHeight"]=true;		
						pushVar["field"]=item;	
						temp.push(pushVar)		
					});
					console.log(temp);
					return temp;
				};
				let temp:Array<any>=[];
				data.map((itemData:any)=>{
					let ctnValue=()=>{
						let qty=0; 
						itemData.transaksi.map((itemTransaksi:any)=>{
							qty=qty+itemTransaksi.qty;
						})
						return qty;
					};
					Object.assign(itemData,{ctn:ctnValue()})
					delete itemData.transaksi;
					temp.push(itemData)
				})
				this.list.data=temp;
				this.list.colDef=getColumnDefs(temp);
				
				
			},
		};
	},
	
	import:{
		message:{
			dataIsEmpty:"DATA_IS_EMPTY_MESSAGE",
			inputInvalid:"INPUT_INVALID_MESSAGE",
		},
		tableColumn:["Seri","Nama Barang","Qty/ C","Ctn","Kode"],
	},
	dbServerUrl:"http://127.0.0.1:3001/",
	pagesObj:["import","daftar"],
	consoleDump:async(x:Array<any>)=>{
		console.log("\\/============================================ C O N S O L E  D U M P ============================================\\/");
		await x.map(item=>{
			console.log(item[0]+" : ",item[1]);
		})
		console.log("/\\============================================ C O N S O L E  D U M P ============================================/\\");
	},
	counter:class counter{
		private startNumber:number;
		private count:number;
		private iterateValue:number;	
		constructor(startNumber:number,iterateValue:number){
			this.startNumber=startNumber;
			this.count=startNumber;
			this.iterateValue=iterateValue;
		};
		public up=()=>{
			this.count=this.count+this.iterateValue;
			return this.count;
		};
		
		public down=()=>{
			this.count=this.count-this.iterateValue;
			return this.count;
		}
		
	},
}