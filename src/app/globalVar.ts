import { ColDef } from 'ag-grid-community';
export const GlobalVar = {
	dbKey:"",
	excelDb:{
		data:{},
		sheetNames:{},
		tableNames:{},
	},
	pages:{},
	stock:class stockData{
		raw:Array<any>=[];
		maxCharLength:any={};
		
		stock:any={
			daftar:{
				data:[],
				colDef:[],
				header:[],
				filterData:[],
				maxCharLength:{},
				defaultFilterParam:{
					supplier:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					kategori:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					ctn:{
						filterType: 'number',
						type:'greaterThanOrEqual',
						filter:1,
					},
					"Qty/ Ctn":{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
				},
				createView:(data:any)=>{
					let getColumnDefs=(data:any)=>{
						let temp:ColDef[];
						if(!data[0])return [];
						let tableColumn=Object.keys(data[0]);
						temp=[];
						tableColumn.map((item:string)=>{
							let pushVar:any={};
							if(item==="_id")pushVar["hide"]=true;//hiding _id column
							if(item==="supplier")pushVar["hide"]=true;
							if(item==="kategori")pushVar["hide"]=true;
							if(item==="ctn")pushVar["editable"]=false;
							if(item==="ctn")pushVar["filter"]='agNumberColumnFilter';
							if(item==="ctn")pushVar["width"]=100;
							if(item==="ctn")pushVar["editable"]=false;
							if(item==="ctn")pushVar["type"]='numericColumn';
							if(item==="nama")pushVar["width"]=300;
							if(item==="nama")pushVar["sort"]='asc';
							if(item==="nama")pushVar["comparator"]=this.customLowerCaseComparator;
							if(item==="Qty/ Ctn")pushVar["width"]=100;
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
					this.stock.daftar.data=JSON.parse(JSON.stringify((temp)));
					this.stock.daftar.maxCharLength=this.getMaxCharLength(temp);
					this.stock.daftar.colDef=getColumnDefs(temp);
					this.stock.daftar.header={};
					if(!!temp[0])this.stock.daftar.header=Object.keys(temp[0]);
					if(!!temp[0])
					this.stock.daftar.filterData=this.generateFilterData(JSON.parse(JSON.stringify((temp))),
						["_id","nama","ctn"]
					);
				},
			},
			transaksi:{
				data:[],
				colDef:[],
				header:[],
				filterData:[],
				maxCharLength:{},
				defaultFilterParam:{
					nama:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					supplier:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					kategori:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					qty:{
						filterType: 'number',
						type:'notEqual',
						filter:0,
					},
					user:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					tanggal:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},
					jenis:{
						filterType: 'text',
						type:'notContains',
						filter:"awal",
					},	
					keterangan:{
						filterType: 'text',
						type:'contains',
						filter:"",
					},					
				},
				createView:(data:any)=>{
					let getColumnDefs=(data:any)=>{
						let temp:ColDef[];
						if(!data[0])return [];
						let tableColumn=Object.keys(data[0]);
						
						temp=[];
						tableColumn.map((item:string)=>{
							let pushVar:any={};
							if(item==="_id")pushVar["hide"]=true;//hiding _id column
							if(item==="_idDaftar")pushVar["hide"]=true;//hiding _id column
							if(item==="nama")pushVar["width"]=300;
							if(item==="supplier")pushVar["width"]=100;
							if(item==="kategori")pushVar["width"]=100;
							if(item==="qty")pushVar["width"]=75;
							if(item==="qty")pushVar["filter"]='agNumberColumnFilter';
							if(item==="qty")pushVar["type"]='numericColumn';
							if(item==="user")pushVar["width"]=100;
							if(item==="tanggal")pushVar["width"]=100;
							if(item==="jenis")pushVar["width"]=100;
							if(item==="keterangan")pushVar["width"]=100;
							pushVar["autoHeight"]=true;		
							pushVar["field"]=item;	
							temp.push(pushVar)		
						});
						return temp;
					};
					let temp:Array<any>=[];
					data.map((itemData:any)=>{
						let nama=itemData.nama;
						let transaksi=itemData.transaksi;
						transaksi.map((item:any)=>{
							if(!!item.tanggal)item.tanggal=this.convertDate(item.tanggal);
							temp.push(Object.assign({
								nama:nama,
								supplier:itemData.supplier,
								kategori:itemData.kategori,
								_idDaftar:itemData._id,
							},item));
						});
					});
					console.log('transaksi => ',JSON.parse(JSON.stringify((temp))))
					this.stock.transaksi.data=JSON.parse(JSON.stringify((temp)));
					this.stock.transaksi.maxCharLength=this.getMaxCharLength(temp);
					this.stock.transaksi.colDef=getColumnDefs(temp);
					this.stock.transaksi.header={};
					if(!!temp[0])this.stock.transaksi.header=Object.keys(temp[0]);
					if(!!temp[0])
					this.stock.transaksi.filterData=this.generateFilterData(JSON.parse(JSON.stringify((temp))),
						['id','nama','qty',]
					);
					console.log(temp);
				},
			},
		};
		constructor(data:Array<any>){
			this.raw=data;
		};
		public findById=(id:string)=>{
			return this.raw.find((item)=>item._id===id)
		};
		length=this.raw.length;
		set=(data:Array<any>)=>{
			this.raw=data;
			Object.keys(this.stock).map(pointer=>{
				this.stock[pointer].createView(JSON.parse(JSON.stringify((data))));
			})
		};
		private getMaxCharLength=(data:Array<any>)=>{
			try{
				let header=Object.keys(data[0]);
				let returnVar:any={};
				header.map(item=>{
					returnVar[item]=0;
				});
				data.map(item=>{
					header.map(headerItem=>{
						let temp=item[headerItem].toString().length;
						if(temp>returnVar[headerItem])returnVar[headerItem]=temp;
					});
				});
				return returnVar;
			}catch(e){
				return 0;
			}
		};
		get=()=>this.raw;
		public generateFilterData=(data:Array<any>,excludedCol:Array<any>)=>{
			let temp:any={};
			data.map(item=>{
				excludedCol.map(excludedColItem=>{
					delete item[excludedColItem];
				});
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
		private convertDate=(dateString:string)=>{
			let temp=new Date(dateString).toLocaleDateString('id');
			return temp;
		};
		private customLowerCaseComparator = (valueA:any, valueB:any) => {
			if (typeof valueA === 'string') {
				return valueA.toLowerCase().localeCompare(valueB.toLowerCase());
			}

			return (valueA > valueB? 1 : (valueA < valueB ? -1 : 0));
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
	alert:(body:any,header?:string|undefined)=>{
		let alertString:string="";
		if(!header)header="";
		if(!!header)header=header+"\n";
		alertString+=header;
		try{
			if(Array.isArray(body)){
				let i=0;
				body.map(item=>{
					alertString+="["+(i+1)+"]"+"\n:";
					Object.keys(item).map((pointer:any)=>{
						alertString+=pointer+"\t:"+item[pointer]+"\n";
					});
					i++;
					alertString+="====================\n";
				});
				return alertString;
			}else{
				Object.keys(body).map((pointer:any)=>{
					alertString+=pointer+"\t:\t"+body[pointer]+"\n";
				});
				return "<a>"+alertString+"</a>";
			}
		}catch(e){
			alert("ERR")
			return
		};
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
		};
	},
}