var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');
const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};
router.get('/', handleErrorAsync(async(req, res, next)=>{
	let idNotaArr=(await db.singleQ("SELECT id_nota from nota")).map(x=>x.id_nota);
	console.log("idNotaArr",idNotaArr);
	let resVar=await Promise.all(idNotaArr.map(async x=>await getEntries(x)))
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
getEntries=async(id_nota)=>{
	let notaTable=(await db.singleQ("select * from nota where id_nota="+id_nota+" limit 1"))[0];
	let entriesTable=await db.singleQ("select * from entries where id_nota="+id_nota);
	let t=await Promise.all(entriesTable.map(async x=>{
		let daftar=(await db.singleQ("select * from daftar where id_daftar="+x.id_daftar))[0];
		let supplier=(await db.singleQ("select * from supplier where ID_SUPPLIER="+daftar.ID_SUPPLIER))[0]||""
		let temp={
			nama:daftar.NAMA,
			supplier:supplier.nama,
			qty:daftar.QTY,
			stn:daftar.STN,
		};
		return temp;
	}));
	let i=0;
	while (i<entriesTable.length){
		Object.assign(entriesTable[i],t[i]);
		i++;
	};
	return Object.assign(notaTable,{entries:entriesTable});
};
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
		]);
	};
	insertEntries=async(entries,columnCount,id_nota)=>{
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
	};	
	
	id_nota=(await insertNota(body,9)).insertId;
	await insertEntries(body.entries,8,id_nota);
	res.json(await getEntries(id_nota));
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
		entries:[{
			id_daftar	
			ctn			
			diskon_1	
			diskon_2	
			diskon_3	
			diskon_dll	
		}]
	}
	////REQUEST
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