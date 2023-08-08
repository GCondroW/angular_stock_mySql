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
		list:{data:any,colDef:any,header:any,filterData:any}={
			data:[],
			colDef:[],
			header:[],
			filterData:[],
			
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
		private createView={
			list:(data:any)=>{
				let getColumnDefs=(data:any)=>{
					let tableColumn=Object.keys(data[0]);
					let temp:ColDef[];
					temp=[];
					tableColumn.map((item:string)=>{
						let pushVar:any={};
						if(item==="_id")pushVar["hide"]=true;//hiding _id column
						if(item==="ctn")pushVar["editable"]=false;
						if(item==="ctn")pushVar["filter"]='agNumberColumnFilter';
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
						});
						return qty;
					};
					let qtyCtn=()=>{
						let qtyCtn:any;
						qtyCtn=(itemData.qty+" "+itemData.stn);
						return qtyCtn;;
					};
					Object.assign(itemData,{
						ctn:ctnValue(),
						['Qty/ Ctn']:qtyCtn(),
					});
					delete itemData.transaksi;
					delete itemData.qty;
					delete itemData.stn;
					temp.push(itemData)
				})
				this.list.data=JSON.parse(JSON.stringify((temp)));
				this.list.colDef=getColumnDefs(temp);
				this.list.header=Object.keys(temp[0]);
				this.list.filterData=this.generateFilterData(temp);
			},
		};
		private generateFilterData=(data:Array<any>)=>{
			let temp:any={};
			data.map(item=>{
				delete item._id;
				delete item.nama;
				delete item.ctn;
			});
			let dataColumn=Object.keys(data[0]);
			dataColumn.map(pointer=>{
				temp[pointer]=[];
			});
			data.map(item=>{
				dataColumn.map(pointer=>{
					temp[pointer].push(item[pointer]);
				});
			});
			dataColumn.map(pointer=>{
				temp[pointer]=[...new Set(temp[pointer])]
				if(pointer!=="ctn") return temp[pointer].sort();
				temp[pointer].sort((a:any, b:any) => (a - b));
			});
			return temp;
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