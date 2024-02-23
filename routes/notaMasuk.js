var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');
const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};
router.get('/', handleErrorAsync(async(req, res, next)=>{
	let resVar=await db.singleQ("SELECT * from nota");
	resVar.map(x=>x.entries=JSON.parse(x.entries));
	res.send(resVar);
}));

class qValues{
	i=0;
	values="";
	constructor(str){
		if(!!str)this.add(str);
	};
	add=(str)=>{
		this.i++;
		if(this.i<=1)return this.values+="("+str+")"; 
		return this.values+=",("+str+")"; 
	};
};

getEntriesView=async(xArr)=>{
	let entryValues=new qValues();
	//console.log("xArr",xArr);
	
	/*
	let temp=xArr.map(x=>{
		return x.entries.map(async x=>await db.singleQ("select * from daftar where id_daftar="+x.id_daftar));
	})
	*/
	
	let arr1=[];
	xArr.map(x=>{
		x.entries.map(x=>{
			if(!arr1.find(val=>val===x.id_daftar))return arr1.push(x.id_daftar)
			return
		})
	});
	arr1.map(x=>entryValues.add(x));
	let temp1=await db.singleQ("select * from daftar where id_daftar in ("+entryValues.values+")")
	console.log("temp1",temp1);
	temp2={};
	temp1.map(x=>temp2[x.ID_DAFTAR]=x);
	console.log(temp2);
	xArr.map(x=>{
		x.entries.map(x=>{
			console.log("x",x.id_daftar.toString());
			console.log("x",x);
			console.log(temp2[x.id_daftar.toString()]);
		})
	});
	

	
	//console.log("entryValues",entryValues.values);
	//console.log("arr1",arr1);
	//console.log("xArr",xArr);
	//console.log("entries",await Promise.all(temp))
	//console.log("	temp:",temp);
	return  xArr;
};
router.get('/view', handleErrorAsync(async(req, res, next)=>{
	/*
		1.select view database
		2.process entries
	*/
	let resVar=await db.singleQ("SELECT * from nota_view_1");
	//console.log("	-resVar = ",resVar);
	resVar.map(x=>{
		x.entries=JSON.parse(x.entries);
	});
	
	//console.log("resVar.entries",resVar.map(x=>x.entries).map(x=>x.id_daftar));
	//console.log("try 1 ",await db.preSttQ("));
	
	//console.log("getEntriesView(resVar)",await getEntriesView(resVar))
	res.send(await getEntriesView(resVar));
	
	/*
	nota_view_1 structure
		id_nota
		tanggal_masuk
		tanggal_nota
		tanggal_input
		no_nota
		no_surat_jalan
		pajak
		user 			> user_name at users join users.id_user - nota.id_user
		supplier		> nama at supplier join supplier.id_supplier - nota.id_supplier
		entries:[{
			id_daftar	
			nama		> nama at daftar join daftar.id_daftar - nota.entries.id_daftar	
			suppplier	> supplier
			qty			> qty
			stn			> stn
			ctn			
			diskon_1	
			diskon_2	
			diskon_3	
			diskon_dll	
		}]
	dbViewQuery:
		nota
			select 
				nota.id_nota,
				nota.tanggal_masuk,
				nota.tanggal_nota,
				nota.tanggal_input,
				nota.no_nota,
				nota.no_surat_jalan,
				nota.pajak,
				users.user_name as 'nama_user',
				supplier.nama as 'nama_supplier',
				nota.entries
			from nota 
				left join users on nota.id_user=users.id_user
				left join supplier on nota.id_supplier=supplier.id_supplier
		entries
			
	*/
}));


router.post('/', handleErrorAsync(async(req, res, next)=>{
	let body=req.body;
	console.log("	-body : ",body);
	let q="insert into nota values(?,?,?,?,?,?,?,?,?,?)";
	
	
	
	insertNota=async(data,columnCount)=>{
		let temp=[];
		temp[0]="";
		let i=0;
		while(i<columnCount){
			if(i===0)temp[0]+="(";
			temp[0]+="?";
			i++;
			if(i<columnCount)temp[0]+=",";
			if(i===columnCount)temp[0]+=")";
		}
		return await db.preSttQ("insert into nota values"+temp[0],[
			null,
			body.tanggal_masuk,
			body.tanggal_nota,
			body.tanggal_input,
			body.no_nota,
			body.no_surat_jalan,
			body.pajak,
			8,
			body.id_supplier,
			null
		]);
	};
	
	insertEntries=async(entries,columnCount,notaQResult)=>{
		let id_nota=notaQResult.insertId
		let entriesCount=entries.length;
		let temp=[];
		temp[0]="";
		let i=0;
		while(i<columnCount){
			if(i===0)temp[0]+="(";
			temp[0]+="?";
			i++;
			if(i<columnCount)temp[0]+=",";
			if(i===columnCount)temp[0]+=")";
		}
		i=0;
		temp[1]="";
		while(i<entriesCount){
			temp[1]+=temp[0];
			i++;
			if(i<entriesCount)temp[1]+=",";
		}
		
		temp[2]=[];
		
		entries.map(x=>{
			temp[2].push(0)
			temp[2].push(x.id_daftar)
			temp[2].push(id_nota)
			temp[2].push(x.ctn)
			temp[2].push(x.diskon_1)
			temp[2].push(x.diskon_2)
			temp[2].push(x.diskon_3)
			temp[2].push(x.diskon_dll)

		});
		temp[3]=await db.preSttQ("insert into entries values"+temp[1],temp[2])
		await db.singleQ("insert id_entry into entries values "+temp[3].insertId)
		
	};	
	await insertEntries(body.entries,8,await insertNota(body,10))
	let resVar=await db.singleQ("select * from nota left join entries on nota.id_entry=entries.id_nota");
	res.json(resVar);
	

	
	/*
	////DB TABLE STRUCTURE
	{
		id_nota			PRIMARY auto-increment
		tanggal_masuk	date	date.toIsoString()	
		tanggal_nota	date	date.toIsoString()
		tanggal_input	dateTime date.toIsoString()
		no_nota			string
		no_surat_jalan	string
		pajak			boolean
		id_user			int
		id_supplier:	int
		json_document:{
			entries:[{
				id_daftar	
				ctn			
				diskon_1	
				diskon_2	
				diskon_3	
				diskon_dll	
			}]
		}
	}
	////REQUEST
	{
		tanggal_masuk:"2014-01-10T17:00:00.000Z",
		tanggal_nota:"2014-01-10T17:00:00.000Z",
		tanggal_input:"2014-01-16T17:00:00.000Z",
		no_nota:"4568796",
		no_surat_jalan:"sj573",
		pajak:0,
		id_supplier:17,
		entries:[{
			id_daftar:1,
			ctn:12,
			diskon_1:7,
			diskon_2:0,
			diskon_3:0,
			diskon_dll:0,
		},{
			id_daftar:45,
			ctn:144,
			diskon_1:9,
			diskon_2:9,
			diskon_3:0,
			diskon_dll:0,
		},{
			id_daftar:13,
			ctn:1,
			diskon_1:0,
			diskon_2:0,
			diskon_3:0,
			diskon_dll:552500,
		},{
			id_daftar:564,
			ctn:63,
			diskon_1:12.5,
			diskon_2:10,
			diskon_3:18,
			diskon_dll:898556,
		}]
	}
	{
		"tanggal_masuk": "2014-02-16T17:00:00.000Z",
		"tanggal_nota": "2014-02-11T17:00:00.000Z",
		"tanggal_input": "2014-02-22T17:00:00.000Z",
		"no_nota": "456879612",
		"no_surat_jalan": "sj111573",
		"pajak": 1,
		"id_supplier": 17,
		"entries": [
			{
			  "id_daftar": 209,
			  "ctn": 12,
			  "diskon_1": 7,
			  "diskon_2": 0,
			  "diskon_3": 0,
			  "diskon_dll": 0
			},
			{
			  "id_daftar": 210,
			  "ctn": 144,
			  "diskon_1": 9,
			  "diskon_2": 9,
			  "diskon_3": 0,
			  "diskon_dll": 0
			},
			{
			  "id_daftar": 211,
			  "ctn": 1,
			  "diskon_1": 0,
			  "diskon_2": 0,
			  "diskon_3": 0,
			  "diskon_dll": 552500
			},
			{
			  "id_daftar": 212,
			  "ctn": 63,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			}
		]
	}
	{
		"tanggal_masuk": "2014-02-17T17:00:00.000Z",
		"tanggal_nota": "2014-02-13T17:00:00.000Z",
		"tanggal_input": "2014-02-25T17:00:00.000Z",
		"no_nota": "423",
		"no_surat_jalan": "sj11",
		"pajak": 1,
		"id_supplier": 12,
		"entries": [
			{
			  "id_daftar": 52,
			  "ctn": 7,
			  "diskon_1": 7,
			  "diskon_2": 0,
			  "diskon_3": 0,
			  "diskon_dll": 0
			},
			{
			  "id_daftar": 1445,
			  "ctn": 15,
			  "diskon_1": 9,
			  "diskon_2": 9,
			  "diskon_3": 0,
			  "diskon_dll": 0
			},
			{
			  "id_daftar": 2356,
			  "ctn": 5,
			  "diskon_1": 0,
			  "diskon_2": 0,
			  "diskon_3": 0,
			  "diskon_dll": 552500
			},
			{
			  "id_daftar": 645,
			  "ctn": 3,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			},
			{
			  "id_daftar": 498,
			  "ctn": 11,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			},
			{
			  "id_daftar": 542,
			  "ctn": 7,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			}
		]
	}
	{
		"tanggal_masuk": "2014-02-19T17:00:00.000Z",
		"tanggal_nota": "2014-02-21T17:00:00.000Z",
		"tanggal_input": "2014-02-28T17:00:00.000Z",
		"no_nota": "1643534",
		"no_surat_jalan": "sj112373",
		"pajak": 0,
		"id_supplier": 11,
		"entries": [
			{
			  "id_daftar": 1789,
			  "ctn": 3,
			  "diskon_1": 7,
			  "diskon_2": 0,
			  "diskon_3": 0,
			  "diskon_dll": 0
			},
			{
			  "id_daftar": 623,
			  "ctn": 4,
			  "diskon_1": 9,
			  "diskon_2": 9,
			  "diskon_3": 0,
			  "diskon_dll": 0
			},
			{
			  "id_daftar": 765,
			  "ctn": 63,
			  "diskon_1": 0,
			  "diskon_2": 0,
			  "diskon_3": 0,
			  "diskon_dll": 552500
			},
			{
			  "id_daftar": 98,
			  "ctn": 5,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			},
						{
			  "id_daftar": 145,
			  "ctn": 65,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			},
						{
			  "id_daftar": 664,
			  "ctn": 2,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			},
						{
			  "id_daftar": 142,
			  "ctn": 1,
			  "diskon_1": 12.5,
			  "diskon_2": 10,
			  "diskon_3": 18,
			  "diskon_dll": 898556
			}
		]
	}
	
	*/
		
}));

router.delete('/', handleErrorAsync(async(req, res, next)=>{
	try{
		let params=req.params;
		let body=req.body;
		let query=req.query;
		let id=query.id;
		let idArr=JSON.parse("["+id+"]");
		let i=0
		let idQ="";
		idArr.map(x=>{
			i++;
			if(i===idArr.length)return idQ+="?";
			return idQ+="?,";
		});
		
		let returnVar={
			nota:await db.preSttQ("DELETE FROM nota where id_nota in "+"("+idQ+")",idArr),
			entries:await db.preSttQ("DELETE FROM entries where id_nota in "+"("+idQ+")",idArr)
		};
		if(returnVar){
			res.status(202);
			res.send(returnVar);
		}else throw new Error("transaksi delete sql error");
	}catch(e){
		throw new Error(e);
	};
}));

router.delete('/all', handleErrorAsync(async(req, res, next)=>{
	
}));

module.exports = router;