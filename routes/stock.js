var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');

const defaultTableName="stock";
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

const getData=async(dbName,id)=>{
	let q="";
	q+="select * from "+dbName+"_view_1";
	if(!!id)q+=" where id_daftar in ("+id+")"
	let returnVar=await db.singleQ(q);
	return returnVar;
};

const updateAllData=async(dbNameArr)=>{
	let temp=[];

	dbNameArr.map(async (dbName)=>{
		getData(dbName).then(x=>{
			temp[dbName]=x
		});
	});
	return await temp;
};

function upsert(array, element) { // (1)
  const i = array.findIndex(_element => _element.nama === element.NAMA);
  if (i > -1) array[i] = element; // (2)
  else array.push(element);
}

router.get('/', handleErrorAsync(async(req, res, next)=>{
	let q="";
	let params=req.params;
	let dbName=params.dbName
	if(!dbName)dbName=defaultTableName;
	let query=req.query;
	let id=!!query.id?query.id:"";
	let resVar=null;
	if(!!id){
		console.log("router>get>sql")
		resVar={
			data:await getData(dbName,id)
		};
	}else{
		console.log("router>get>tableViewCache")
		resVar={
			data:req.app.tableViewCache.data[dbName],
		};
	};
	resVar.data.map(item=>item.STOCK=Number(item.STOCK));
	console.log("EMIT_AT_GET",
		//req.app.io.emit("GET",resVar)
	);
	res.json(resVar);
}));

router.delete('/', handleErrorAsync(async(req, res, next)=>{
	let tempStr='';
	let q=[];
	let params=req.params;
	let idFromBody=req.body.id?req.body.id:"";
	//let dbName=params.dbName;
	let query=req.query;
	let id=!!query.id?query.id:idFromBody;
	if(!id)throw new Error("ID_NEEDED");
	let idArray=JSON.parse("["+id+"]");
	let temp=await db.multQ([
		"SET @ROW_TO_DELETE = "+idArray.length+";",
		"SET @MAX_ROW =( SELECT COUNT(*) FROM daftar);",
		"SELECT IF(@ROW_TO_DELETE >= @MAX_ROW, TRUE, FALSE);"
	]);
	isDeleteAll=Object.keys(temp[0]).map(item=>temp[0][item])[0];
	
	q.push('CREATE TEMPORARY TABLE TEMP_TABLE AS SELECT * FROM daftar '+(!!id?'where id_daftar in '+'('+id+')'+';':';'));
	if(!!isDeleteAll){
		q.push("DELETE FROM daftar;");
		q.push("ALTER TABLE daftar AUTO_INCREMENT = 1;");
		q.push("DELETE FROM transaksi;");
		q.push("ALTER TABLE transaksi AUTO_INCREMENT = 1;");
	}else{
		q.push("DELETE FROM daftar WHERE ID_DAFTAR in ("+id+");");
		q.push("DELETE FROM transaksi WHERE ID_DAFTAR in ("+id+");")
	}
	
	q.push('select * from TEMP_TABLE;')
	
	console.log("SQL QUERY : ",q);
	
	let resVar=await db.multQ(q);
	console.log("delete resVar",resVar);
	await req.app.tableViewCache.delete(idArray);
		
	let emitVar={
		dbKey:req.app.dbKey.up(),
		deletedDataId:resVar.map(item=>item.ID_DAFTAR),
		message:"DELETE_MESSAGE",
	};
	console.log("EMIT_AT_DELETE",
		req.app.io.emit("delete",emitVar)
	);
	res.status(202);
	res.send({success:true});
	//res.json(resVar);
}));

router.post('/', handleErrorAsync(async(req, res, next)=>{
	let data=req.body;
	let q_SUPPLIER=new qValues();
	let user=req.get('user')?req.get('user'):'Guest-1';
	data=JSON.parse(JSON.stringify(data).toUpperCase());
	data.map(item=>item.SUPPLIER).forEach(item=>
		item!=""?
		q_SUPPLIER.add(
			`(SELECT id_supplier FROM supplier WHERE nama ="`+item+`"),"`+item+`"`
		)
		:""
	);
	console.log("q_xupplier",q_SUPPLIER.values);
	let q_DAFTAR=new qValues();
	data.forEach(item=>{
		q_DAFTAR.add(
			'NULL,'+	
			'"'+item.NAMA+'",'+	
			'"'+item.QTY+'",'+
			'"'+item.STN+'",'+
			'"'+item.KATEGORI+'",'+
			"(SELECT id_supplier FROM supplier where nama =\""+item.SUPPLIER+"\"),"+
			"NULL,"+
			"\""+item.CTN+"\","+
			"\""+user+"\","+
			"(SELECT NOW()),"+
			"\"AWAL\","+
			"\"STOCK AWAL\""
		);
	});
	
	
	
	let q=[];
	q=[
		`CREATE TEMPORARY TABLE TEMP_TABLE_SUPPLIER(
			ID_SUPPLIER INT,
			NAMA VARCHAR(64)
		);`,
		`INSERT INTO TEMP_TABLE_SUPPLIER(ID_SUPPLIER, NAMA)
		VALUES `+q_SUPPLIER.values+`;`,
		`REPLACE
			INTO supplier(ID_SUPPLIER, NAMA)
			SELECT DISTINCT
			ID_SUPPLIER,
			NAMA
		FROM
			TEMP_TABLE_SUPPLIER;`,
		`CREATE TEMPORARY TABLE TEMP_TABLE AS SELECT 
			daftar.ID_DAFTAR,
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER,
			ID_TRANSAKSI,
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN
		FROM
			daftar
		LEFT JOIN transaksi ON daftar.ID_DAFTAR = transaksi.ID_DAFTAR
		LIMIT 0;`,
		"ALTER TABLE TEMP_TABLE CHANGE ID_DAFTAR ID_DAFTAR INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY;",
		"ANALYZE TABLE `daftar`;", 
		`SET @max_id =(
			SELECT T.AUTO_INCREMENT 
			FROM information_schema.TABLES T 
			WHERE T.TABLE_SCHEMA = '`+db.config.database+`' 
			AND T.TABLE_NAME = 'daftar'
		);`,
		'-- "SET @max_id =(SELECT MAX(ID_DAFTAR) FROM daftar);", --',
		"SET @sql = CONCAT('ALTER TABLE TEMP_TABLE AUTO_INCREMENT=',COALESCE(@max_id, 1));",
		"PREPARE st FROM @sql;",
		"EXECUTE st;",
		`INSERT INTO TEMP_TABLE (
			ID_DAFTAR,
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER,
			ID_TRANSAKSI,
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN
		)
		VALUES `+q_DAFTAR.values+`;`,
		`INSERT INTO daftar (
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER
		)SELECT 
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER 
		FROM TEMP_TABLE;`,
		
		`INSERT INTO transaksi (
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN,
			ID_DAFTAR
		)SELECT 
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN,
			ID_DAFTAR 
		FROM TEMP_TABLE;`,
		`SELECT 
			stock_view_1.ID_DAFTAR,
			stock_view_1.NAMA,
			stock_view_1.SUPPLIER,
			stock_view_1.QTY,
			stock_view_1.STN,
			stock_view_1.KATEGORI,
			stock_view_1.STOCK
		FROM stock_view_1 RIGHT JOIN TEMP_TABLE on stock_view_1.ID_DAFTAR=TEMP_TABLE.ID_DAFTAR;`
	]
	console.log("SQL QUERY : ",q);
	//console.log("q_DAFTAR : ",q_DAFTAR.values);
	let resVar={};
	let resetVar={
		daftar:await db.singleQ("ALTER TABLE `daftar` CHANGE `ID_DAFTAR` `ID_DAFTAR` INT UNSIGNED NOT NULL AUTO_INCREMENT;"),
		transaksi:await db.singleQ("ALTER TABLE `transaksi` CHANGE `ID_TRANSAKSI` `ID_TRANSAKSI` INT UNSIGNED NOT NULL AUTO_INCREMENT;"),
	}
	console.log("reset autoIncrement",resetVar)
	resVar['stock']=await db.multQ(q);
	console.log("resVar['stock']",resVar['stock'])
	resVar['transaksi']=await db.singleQ("SELECT * FROM transaksi_view_1 WHERE ID_DAFTAR="+resVar.stock[0].ID_DAFTAR);
	resVar.stock.map(item=>item.STOCK=Number(item.STOCK));
	await req.app.tableViewCache.addStock(resVar);
	let emitVar={
		dbKey:req.app.dbKey.up(),
		data:resVar.stock,
		message:"POST_UPDATED_MESSAGE",
	};
	console.log('EMIT_AT_POST',req.app.io.emit('post',emitVar));
	res.status(202);
	res.send({success:true});
	//res.json(await db.multQ(q));
}));

router.put('/', handleErrorAsync(async(req, res, next)=>{
	let data=req.body;
	let user=req.get('user')?req.get('user'):'Guest-1';
	data=JSON.parse(JSON.stringify(data).toUpperCase());
	let q_SUPPLIER=new qValues();
	let q_values=new qValues();
	let q_idArr=new qValues();
	data.map(item=>{
		let supplier="(SELECT id_supplier FROM supplier where nama ='"+item.SUPPLIER+"')"
		q_values.add("'"+item.ID_DAFTAR+"','"+item.KATEGORI+"','"+item.NAMA+"','"+item.QTY+"','"+item.STN+"',"+supplier+"");
		q_idArr.add(item.ID_DAFTAR);
		return item.SUPPLIER;
	}).forEach(item=>
		item!=""?
		q_SUPPLIER.add(
			`(SELECT id_supplier FROM supplier WHERE nama ='`+item+`' ),'`+item+`'`
		)
		:""
	);
	/*
	data.map(item=>{
		let supplier="(SELECT id_supplier FROM supplier where nama ='"+item.SUPPLIER+"')"
		q_values.add("'"+item.ID_DAFTAR+"','"+item.KATEGORI+"','"+item.NAMA+"','"+item.QTY+"','"+item.STN+"',"+supplier+"");
	});
	*/
	let q=[
		`CREATE TEMPORARY TABLE TEMP_TABLE_SUPPLIER(
			ID_SUPPLIER INT,
			NAMA VARCHAR(64)
		);`,
		`INSERT INTO TEMP_TABLE_SUPPLIER(ID_SUPPLIER, NAMA)
		VALUES `+q_SUPPLIER.values+`;`,
		`REPLACE
			INTO supplier(ID_SUPPLIER, NAMA)
			SELECT DISTINCT
			ID_SUPPLIER,
			NAMA
		FROM
			TEMP_TABLE_SUPPLIER;`,
		`INSERT INTO daftar (ID_DAFTAR,KATEGORI,NAMA,QTY,STN,ID_SUPPLIER) 
		VALUES `+q_values.values+`
		ON DUPLICATE KEY UPDATE 
			ID_DAFTAR=VALUES(ID_DAFTAR),
			NAMA=VALUES(NAMA),
			QTY=VALUES(QTY),
			STN=VALUES(STN),
			KATEGORI=VALUES(KATEGORI),
			ID_SUPPLIER=VALUES(ID_SUPPLIER);`,
		"SELECT * FROM stock_view_1 where ID_DAFTAR in("+q_idArr.values+");"
			
	]

	let resVar=await db.multQ(q);
	resVar.map(item=>item.STOCK=Number(item.STOCK));
	await req.app.tableViewCache.editStock(resVar);
	//if(!!resVar.STOCK)resVar.STOCK=number(resVar.STOCK);//convert string to number
	let emitVar={
		dbKey:req.app.dbKey.up(),
		data:resVar,
		message:"PUT_UPDATED_MESSAGE",
	};
	console.log('EMIT_AT_PUT',req.app.io.emit('put',emitVar));
	res.status(202);
	res.send({success:true});
}));

router.post('/excelupload_new', handleErrorAsync(async(req, res, next)=>{
	let data=JSON.parse(JSON.stringify(req.body).toUpperCase());;
	
	
	let daftar=[];
	let transaksi=[];
	

	let setTransaksi=async()=>{};
	let setSatuan=async(data)=>{
		let satuan=[];
		let temp=await Promise.all(data.map(async x=>{
			let qty_l=x['QTY L'];
			let stn_l=x['STN L'];
			let qty_m=x['QTY M'];
			let stn_m=x['STN M'];
			let qty_s=x['QTY S'];
			let stn_s=x['STN S'];
			let q = (await db.singleQ(`select id_satuan 
					from satuan 
						where 	qty_l=`+qty_l+` and 
								stn_l='`+stn_l+`' and
								qty_m=`+qty_m+` and
								stn_m='`+stn_m+`' and
								qty_s=`+qty_s+` and 
								stn_s='`+stn_s+`';`
			))[0]||"";
			return {
				id_satuan:q?q.id_satuan:null,
				qty_l:qty_l,
				stn_l:stn_l,
				qty_m:qty_m,
				stn_m:stn_m,
				qty_s:qty_s,
				stn_s:stn_s,
			}
		}));
		temp=temp.map(x=>JSON.stringify(x));
		tempSet = [...new Set(temp)];
		for (const item of tempSet) {
		  satuan.push(JSON.parse(item));
		};
		let q_satuan=new qValues();
		satuan.map(x=>{
			q_satuan.add(x.id_satuan+",'"+x.qty_l+"','"+x.stn_l+"','"+x.qty_m+"','"+x.stn_m+"','"+x.qty_s+"','"+x.stn_s+"'")
		});
		satuan=await db.multQ([
			`CREATE TEMPORARY TABLE temp_table_satuan(
				id_satuan INT,
				qty_l INT,
				stn_l VARCHAR(64),
				qty_m INT,
				stn_m VARCHAR(64),
				qty_s INT,
				stn_s VARCHAR(64)
			);`,
			`INSERT INTO temp_table_satuan(id_satuan,qty_l,stn_l,qty_m,stn_m,qty_s,stn_s) VALUES `+q_satuan.values+`;`,
			`REPLACE
				INTO satuan(id_satuan,qty_l,stn_l,qty_m,stn_m,qty_s,stn_s)
				SELECT DISTINCT
				id_satuan,
				qty_l,
				stn_l,
				qty_m,
				stn_m,
				qty_s,
				stn_s
			FROM
				TEMP_TABLE_satuan;`,
			"SELECT * from satuan;"
		]);
		return satuan;
	};
	let setSupplier=async(data)=>{
		/*
			id_supplier
			nama
			KATEGORI
			
		*/
		let tempSet=new Set();
		let supplier=[];
		let i=0;
		//KEY/COLUMN NAME NEED TO BE UPPERCASED
		data.forEach(x=>{
			tempSet.add(JSON.stringify({
				nama:x.SUPPLIER,
				kategori:x.KATEGORI,
			}));
		});
		
		for (const item of tempSet) {
		  supplier.push(JSON.parse(item));
		};
		
		supplier=await Promise.all(supplier.map(async (x)=>{
			console.log(x.nama);
			let q = (await db.singleQ("select id_supplier from supplier where nama = "+"'"+x.nama+"'"))[0]||""
			return {
				id:q?q.id_supplier:null,
				nama:x.nama,
				kategori:x.kategori,
			};
		}));
		
		let q_supplier=new qValues();
		console.log("supplier",supplier)
		supplier.map(x=>{
			q_supplier.add(x.id+",'"+x.nama+"','"+x.kategori+"'")
		})
		
		console.log("q_supplier.values",q_supplier.values)
		supplier=await db.multQ([
			`CREATE TEMPORARY TABLE TEMP_TABLE_SUPPLIER(
				id_supplier INT,
				nama VARCHAR(64),
				kategori VARCHAR(64)
			);`,
			`INSERT INTO TEMP_TABLE_SUPPLIER(ID_SUPPLIER, NAMA,kategori) VALUES `+q_supplier.values+`;`,
			`REPLACE
				INTO supplier(ID_SUPPLIER, NAMA,KATEGORI)
				SELECT DISTINCT
				ID_SUPPLIER,
				NAMA,
				kategori
			FROM
				TEMP_TABLE_SUPPLIER;`,
			"SELECT * from supplier;"
		])
		return supplier;
	};
	let setDaftar=async(data)=>{
		/*
			id_daftar
			nama
			id_supplier
			id_satuan
		*/
	
		let temp=data.map(x=>{
			return {
				nama:x.NAMA,
				supplierValue:x.SUPPLIER+x.KATEGORI,
				satuanValue:x['QTY L']+x['STN L']+x['QTY M']+x['STN M']+x['QTY S']+x['STN S'],
			}
		});
		let index={
			supplier:	(await db.singleQ("select id_supplier,nama,kategori from supplier")).map(x=>{return {id:x.id_supplier,value:x.nama+x.kategori}}),
			satuan:		(await db.singleQ("select id_satuan,qty_l,stn_l,qty_m,stn_m,qty_s,stn_s from satuan")).map(x=>{return {id:x.id_satuan,value:x.qty_l+x.stn_l+x.qty_m+x.stn_m+x.qty_s+x.stn_s}}),
		};
		
		temp=temp.map(x=>{
			return {
				nama:x.nama,
				id_supplier:index.supplier.find(y=>y.value===x.supplierValue).id,
				id_satuan:index.satuan.find(y=>y.value===x.satuanValue).id,
			}
			
		});
			
		
		//return temp;
		let a=temp.map(x=>[null,x.nama,x.id_supplier,x.id_satuan]);
		console.log("a.map(x=>['(?,?,?,?)'])",a.map(x=>['(?,?,?,?)']))
		return await(db.preSttQ("insert into daftar values ?",[a]))
	};
	
	
	let resVar={
		supplier:await setSupplier(data),
		satuan:await setSatuan(data),
		daftar:await setDaftar(data),
		//supplier:await setSupplier(data),
		//satuan:await setSatuan(data),
	};
	res.send(resVar);
}));

router.post('/excelupload', handleErrorAsync(async(req, res, next)=>{
	let data=req.body;
	data=JSON.parse(JSON.stringify(data).toUpperCase());
	let user=req.get('user')?req.get('user'):'Guest-1';
	let q_SUPPLIER=new qValues();
	data.map(item=>item.SUPPLIER).forEach(item=>
		item!=""?
		q_SUPPLIER.add(
			`(SELECT id_supplier FROM supplier WHERE nama ="`+item+'" ),"'+item+`"`
		)
		:""
	);
	let q_DAFTAR=new qValues();
	data.forEach(item=>{
		q_DAFTAR.add(
			"NULL,"+	
			"'"+item.NAMA+"',"+	
			"'"+item.QTY+"',"+
			"'"+item.STN+"',"+
			"'"+item.KATEGORI+"',"+
			"(SELECT id_supplier FROM supplier where nama ='"+item.SUPPLIER+"'),"+
			"'NULL',"+
			"'"+item.STOCK+"',"+
			"'"+user+"',"+
			"(SELECT NOW()),"+
			"'AWAL',"+
			"'STOCK AWAL'"
		);

	});
	console.log(q_DAFTAR.value);
	let q=[];
	q=[
		"DELETE FROM daftar;",
		"ALTER TABLE daftar AUTO_INCREMENT = 1;",
		"DELETE FROM transaksi;",
		"ALTER TABLE transaksi AUTO_INCREMENT = 1;",
		"DELETE FROM supplier;",
		"ALTER TABLE supplier AUTO_INCREMENT = 1;",
		`CREATE TEMPORARY TABLE TEMP_TABLE_SUPPLIER(
			ID_SUPPLIER INT,
			NAMA VARCHAR(64)
		);`,
		`INSERT INTO TEMP_TABLE_SUPPLIER(ID_SUPPLIER, NAMA)
		VALUES `+q_SUPPLIER.values+`;`,
		`REPLACE
			INTO supplier(ID_SUPPLIER, NAMA)
			SELECT DISTINCT
			ID_SUPPLIER,
			NAMA
		FROM
			TEMP_TABLE_SUPPLIER;`,
		`CREATE TEMPORARY TABLE TEMP_TABLE AS SELECT 
			daftar.ID_DAFTAR,
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER,
			ID_TRANSAKSI,
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN
		FROM
			daftar
		LEFT JOIN transaksi ON daftar.ID_DAFTAR = transaksi.ID_DAFTAR;`,
		"ALTER TABLE TEMP_TABLE CHANGE ID_DAFTAR ID_DAFTAR INT( 11 ) NOT NULL AUTO_INCREMENT PRIMARY KEY;",
		`INSERT INTO TEMP_TABLE (
			ID_DAFTAR,
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER,
			ID_TRANSAKSI,
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN
		)
		VALUES `+q_DAFTAR.values+`;`,
		`INSERT INTO daftar (
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER
		)SELECT 
			NAMA,
			QTY,
			STN,
			KATEGORI,
			ID_SUPPLIER 
		FROM TEMP_TABLE;`,
		`INSERT INTO transaksi (
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN,
			ID_DAFTAR
		)SELECT 
			JUMLAH,
			USER,
			TANGGAL,
			JENIS,
			KETERANGAN,
			ID_DAFTAR 
		FROM TEMP_TABLE;`,
		"SET @MAX_ID_DAFTAR =(SELECT MAX(ID_DAFTAR) FROM daftar);",
		"SET @MAX_ID_SUPPLIER =(SELECT MAX(ID_SUPPLIER) FROM supplier);",
		"SET @MAX_ID_TRANSAKSI =(SELECT MAX(ID_TRANSAKSI) FROM transaksi);",
		`SET @sql = CONCAT(
			"ALTER TABLE daftar AUTO_INCREMENT=",
			COALESCE(@MAX_ID_DAFTAR+1, 1),
			";"
		);`,
		"SELECT @sql;",
		"PREPARE st FROM @sql;",
		"EXECUTE st;",
		`SET @sql = CONCAT(
			"ALTER TABLE supplier AUTO_INCREMENT=",
			COALESCE(@MAX_ID_SUPPLIER+1, 1),
			";"
		);`,
		"SELECT @sql;",
		"PREPARE st FROM @sql;",
		"EXECUTE st;",
		`SET @sql = CONCAT(
			"ALTER TABLE transaksi AUTO_INCREMENT=",
			COALESCE(@MAX_ID_TRANSAKSI+1, 1),
			";"
		);`,
		"SELECT @sql;",
		"PREPARE st FROM @sql;",
		"EXECUTE st;"
	]
	//,
	//	"SELECT * FROM stock_view_1;"
	//console.log("SQL QUERY : ",q);
	//console.log("q_DAFTAR : ",q_DAFTAR.values);
	
	if(!!await db.multQ(q)){
		await req.app.tableViewCache.getView();
		req.app.dbKey.resetValue();
		let resVar={
			message:"DATA_UPDATED_FROM_EXCELUPLOAD",
		};
		console.log('EMIT_AT_EXELUPLOAD',req.app.io.emit('init',resVar));
		res.status(202);
		res.send({success:true});
	}else{
		throw new Error("multi query failed");
	};
	

	//res.json(await db.multQ(q));
}));

router.get('/test',(req,res,next)=>{
	console.log("req.get('dbKey')",req.get('dbKey'));
	console.log("req.get('user')",req.get('user'));
	let resVar={
		dbKey:req.get('dbKey'),
		user:req.get('user'),
		"connectionTest":db.connectionTest(),
	};
	res.status(202);
	res.send({success:true,resVar:resVar});
});

/*
router.post('/transaksi', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let body=req.body;
	console.log("params ", params);
	console.log("body ", body);
	let dbName="TRANSAKSI";
	if(!dbName)throw new Error("DB_NAME_NOT_SPECIFIED");
	if(body.length===1){
		body=body[0];
		//let currentTime=await db.singleQ("SELECT NOW()")[0]["NOW()"];
		let currentTime=Date();
		console.log("currentTime",currentTime)
		let q="INSERT INTO TRANSAKSI(JUMLAH,USER,TANGGAL,JENIS,KETERANGAN,ID_DAFTAR) VALUES(?,?,?,?,?,?)";
		let v=[body.JUMLAH,"SUPER",currentTime,body.JENIS,body.KETERANGAN,body.ID_DAFTAR];
		let resVar=await db.preSttQ(q,v);
		let insertedData=await db.singleQ("SELECT * FROM stock_view_1 WHERE ID_DAFTAR="+body.ID_DAFTAR);
		console.log("DEBUG ",resVar);
		let emitVar={
			dbKey:req.app.dbKey.up(),
			data:insertedData,
			message:"POST_UPDATED_MESSAGE",
		};
		console.log('EMIT_AT_POST_TRANSAKSI',req.app.io.emit('transaksi',emitVar));
		//res.json(resVar);
	}else throw new Error("POST_EXCEPTION");
}));
*/

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