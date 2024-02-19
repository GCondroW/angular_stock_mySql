var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');
const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};
router.get('/', handleErrorAsync(async(req, res, next)=>{
	res.send(await db.singleQ("SELECT * from nota"))
}));


router.post('/', handleErrorAsync(async(req, res, next)=>{
	let body=req.body;
	let q="insert into nota values(?,?,?,?,?,?,?,?,?)";
	let v=[
		null,
		body.tanggal_masuk,
		body.tanggal_nota,
		new Date(),
		body.no_nota,
		body.no_surat_jalan,
		body.pajak,
		"guest42",
		JSON.stringify(body.entry)
		]
	let resVar=await db.preSttQ(q,v);
		
	
	
		
	/*{
		tanggal_masuk:new Date(29-02-2024),
		tanggal_nota:new Date(23-02-2024),
		no_nota:"4568796",
		no_surat_jalan:"sj573",
		pajak:"NON",
		entry:[{
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
	}*/
		
	
	res.json(resVar.insertId);
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
		let q="DELETE FROM nota where id_nota in "+"("+idQ+")";
		//let newlyDeletedData=await db.preSttQ("SELECT * FROM transaksi WHERE ID_DAFTAR in "+"("+idQ+")",idArr);
		let returnVar=await db.preSttQ(q,idArr)
		if(returnVar){

			res.status(202);
			res.send(returnVar);
		}else throw new Error("transaksi delete sql error");
	}catch(e){
		throw new Error(e);
	};
}));

module.exports = router;