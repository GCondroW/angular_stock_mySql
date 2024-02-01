var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');

const defaultTableName="transaksi";
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
	let q="";
	let params=req.params;
	let dbName=params.dbName;
	if(!dbName)dbName=defaultTableName;
	let query=req.query;
	let id=!!query.id?query.id:"";
	let resVar=null;
	if(!!id){
		q+="select * from "+dbName+"_view_1";
		q+=" where id_daftar in ("+id+")";
		console.log("router>get>sql")
		resVar={
			data:await db.singleQ(q),
		};
	}else{
		console.log("router>get>tableViewCache")
		resVar={
			data:req.app.tableViewCache.data[dbName],
		};
	};
	console.log("EMIT_AT_GET",);
	res.json(resVar);
}));

router.post('/', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let body=req.body;
	let user=req.get('user')?req.get('user'):'Guest-1';
	if(body.length===1){
		body=body[0];
		//let currentTime=await db.singleQ("SELECT NOW()")[0]["NOW()"];
		let currentTime=new Date();
		console.log("currentTime",currentTime)
		let q="INSERT INTO transaksi(JUMLAH,USER,TANGGAL,JENIS,KETERANGAN,ID_DAFTAR) VALUES(?,?,?,?,?,?)";
		let v=[body.JUMLAH,user,currentTime,body.JENIS,body.KETERANGAN,body.ID_DAFTAR];
		let resVar=await db.preSttQ(q,v);
		let insertedData=await db.singleQ("SELECT * FROM "+defaultTableName+"_view_1 WHERE ID_TRANSAKSI="+resVar.insertId);
		insertedData=await req.app.tableViewCache.addTransaksi(insertedData);
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
		let q="DELETE FROM transaksi where ID_DAFTAR in "+"("+idQ+")";
		let newlyDeletedData=await db.preSttQ("SELECT * FROM transaksi WHERE ID_DAFTAR in "+"("+idQ+")",idArr);
		console.log("idQ",idQ);
		console.log("newlyDeletedData",newlyDeletedData);
		if(await db.preSttQ(q,idArr)){
			idArr=await req.app.tableViewCache.deleteTransaksi(idArr);
			let emitVar={
				dbKey:req.app.dbKey.up(),
				data:newlyDeletedData,
				message:"TRANSACTION DELETED MESSAGE",
			};
			res.status(202);
			res.send({success:true,data:emitVar});
			console.log('EMIT_AT_DELETE_TRANSAKSI',req.app.io.emit('deleteTransaksi',emitVar));
		}else throw new Error("transaksi delete sql error");
	}catch(e){
		throw new Error(e);
	};
}));

router.post('/excelupload', handleErrorAsync(async(req, res, next)=>{
	let data=req.body;
	data=JSON.parse(JSON.stringify(data).toUpperCase());
	let userName=req.get('user')?req.get('user'):'Guest-1';
	let q_SUPPLIER=new qValues();
	data.map(item=>item.SUPPLIER).forEach(item=>
		item!=""?
		q_SUPPLIER.add(
			`(SELECT id_supplier FROM supplier WHERE nama ="`+item+`"),"`+item+`"`
		)
		:""
	);
	q_DAFTAR=new qValues();
	data.map(item=>{return {NAMA:item.NAMA,SUPPLIER:item.SUPPLIER,JUMLAH:item.JUMLAH}}).forEach(item=>
		item!=""?
		q_DAFTAR.add(
			`(SELECT ID_DAFTAR FROM DAFTAR WHERE nama ="`+item.NAMA+`"),"`+item.NAMA+`",`+`(SELECT ID_SUPPLIER FROM SUPPLIER WHERE nama ="`+item.SUPPLIER+`"),`+item.JUMLAH
		)
		:""
	);
	let q=[
		`CREATE TEMPORARY TABLE TEMP_TABLE_SUPPLIER(
			ID_SUPPLIER INT,
			NAMA VARCHAR(64)
		);`,
		`INSERT INTO TEMP_TABLE_SUPPLIER(ID_SUPPLIER, NAMA) VALUES `+q_SUPPLIER.values+`;`,
		`REPLACE
			INTO supplier(ID_SUPPLIER, NAMA)
			SELECT DISTINCT
			ID_SUPPLIER,
			NAMA
		FROM
			TEMP_TABLE_SUPPLIER;`,
			
			
		`CREATE TEMPORARY TABLE TEMP_TABLE_DAFTAR(
			ID_DAFTAR INT,
			NAMA VARCHAR(64),
			ID_SUPPLIER INT,
			JUMLAH INT (16)
		);`,
		`INSERT INTO TEMP_TABLE_DAFTAR(ID_DAFTAR, NAMA, ID_SUPPLIER, JUMLAH)VALUES `+q_DAFTAR.values+`;`,
		`REPLACE
			INTO DAFTAR(ID_DAFTAR, NAMA, ID_SUPPLIER)
			SELECT DISTINCT
			id_daftar,
			NAMA,
			id_supplier
		FROM
			TEMP_TABLE_DAFTAR;`,	
		`select ID_DAFTAR, JUMLAH from TEMP_TABLE_DAFTAR;`
	];
	let temp=await db.multQ(q);
	if(!temp)throw new Error("excelUpload transaction step 1 failed")
	console.log("excelUpload transaction step 1 succes, commence step 2")
		let ID_DAFTAR;
		let JUMLAH;
		let USER=userName;
		let TANGGAL=new Date();
		let JENIS="";
		let KETERANGAN="";
		q="insert into transaksi (ID_DAFTAR,jumlah, user, tanggal, jenis, keterangan) values (?,?,?,?,?,?);"
		let v=[];
		let i=0;
	temp.map(item=>{
		ID_DAFTAR=item.ID_DAFTAR;
		JUMLAH=item.JUMLAH;
		//USER;
		//TANGGAL;
		//JENIS;
		//KETERANGAN;
		v[i]=[];
		v[i].push(ID_DAFTAR,JUMLAH,USER,TANGGAL,JENIS,KETERANGAN);
		i++;
	});
	i=0;
	
	//let insertedIdArr=temp.map(item=>{id_daftar});
	let b=[];
	temp=temp.map(async (item)=>{
		let temp=await db.preSttQ(q,v[i]);
		b[i]=await db.singleQ("select LAST_INSERT_ID()")
		i++;
		return temp
	});
	
	await Promise.all(temp);
	//let insertedData=await db.singleQ("SELECT * FROM "+defaultTableName+"_view_1 WHERE ID_TRANSAKSI="+insertedIdArr);
	//insertedData=await req.app.tableViewCache.addTransaksi(insertedData);
	/*
	let emitVar={
		dbKey:req.app.dbKey.up(),
		data:insertedData,
		message:"POST_UPDATED_MESSAGE",
	};
	*/
	//console.log('EMIT_AT_POST_TRANSAKSI',req.app.io.emit('transaksi',emitVar));
	res.status(202);
	console.log(temp[0].insertId )
	console.log("b",b);
	res.send({success:true,temp:temp});
	
}));

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