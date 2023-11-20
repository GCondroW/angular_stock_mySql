var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');

const defaultTableName="transaksi_view_1";
const defaultDbName="test";
const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};

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

const outputDebug=(req)=>{
	let temp={
		params:req.params,
		body:req.body,
		query:req.query,
		id:req.query.id
	};
	console.log(temp);
	return temp;
};

router.get('/', handleErrorAsync(async(req, res, next)=>{
	console.log('get transaksi');
	let q="";
	let params=req.params;
	let dbName=params.dbName;
	console.log("params",params);
	if(!dbName)dbName=defaultTableName;
	let query=req.query;
	let id=!!query.id?query.id:"";
	q+="select * from "+dbName;
	if(!!id)q+=" where id_daftar in ("+id+")";
	let resVar={
		dbKey:req.app.dbKey.value,
		data:await db.singleQ(q),
	};
	console.log("EMIT_AT_GET",
		req.app.io.emit("GET",resVar)
	);
	//console.log("resVar",resVar);
	res.json(resVar);
}));

router.post('/', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let body=req.body;
	console.log("params ", params);
	console.log("body ", body);
	let dbName="TRANSAKSI";
	if(!dbName)throw new Error("DB_NAME_NOT_SPECIFIED");
	if(body.length===1){
		body=body[0];
		//let currentTime=await db.singleQ("SELECT NOW()")[0]["NOW()"];
		let currentTime=new Date();
		console.log("currentTime",currentTime)
		let q="INSERT INTO TRANSAKSI(JUMLAH,USER,TANGGAL,JENIS,KETERANGAN,ID_DAFTAR) VALUES(?,?,?,?,?,?)";
		let v=[body.JUMLAH,"SUPER",currentTime,body.JENIS,body.KETERANGAN,body.ID_DAFTAR];
		let resVar=await db.preSttQ(q,v);
		let insertedData=await db.singleQ("SELECT * FROM "+defaultTableName+" WHERE ID_TRANSAKSI="+resVar.insertId);
		console.log("DEBUG ",resVar);
		let emitVar={
			dbKey:req.app.dbKey.up(),
			data:insertedData,
			message:"POST_UPDATED_MESSAGE",
		};
		console.log('EMIT_AT_POST_TRANSAKSI',req.app.io.emit('transaksi',emitVar));
		res.status(202);
		res.send({success:true});
	}else throw new Error("POST_EXCEPTION");
}));

router.get('/test',(req,res,next)=>{
	console.log("req.get('dbKey')",req.get('dbKey'));
	console.log("req.get('user')",req.get('user'));
	let resVar={
		dbKey:req.get('dbKey'),
		user:req.get('user'),
	};
	res.status(202);
	res.send({success:true,resVar:resVar});
});

module.exports = router;


/*

==PREPARED STATEMENT
PREPARE stmt1 FROM "INSERT INTO transaksi (JUMLAH,USER,TANGGAL,JENIS,KETERANGAN,ID_DAFTAR)VALUES(?,?,?,?,?,?)";
SET @A1=12;
SET @A2="ASD";
SET @A3=(SELECT NOW());
SET @A4="ASDV";
SET @A5="L";
SET @A6=1;
EXECUTE stmt1 USING @A1,@A2,@A3,@A4,@A5,@A6;

==IMPROVED VIEW SQL SYNTAX
SELECT 
	transaksi.ID_TRANSAKSI AS ID_TRANSAKSI,
    transaksi.JUMLAH AS JUMLAH,
    transaksi.USER AS USER,
    transaksi.TANGGAL AS TANGGAL,
    transaksi.JENIS AS JENIS,
    transaksi.KETERANGAN AS KETERANGAN,
    daftar.NAMA AS NAMA,
    daftar.KATEGORI AS KATEGORI,
    supplier.NAMA AS SUPPLIER
    FROM transaksi LEFT JOIN daftar USING (ID_DAFTAR) LEFT JOIN supplier USING(ID_SUPPLIER)

*/