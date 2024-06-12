var express = require('express');
var router = express.Router();
var app = express();
const fs = require('fs');


const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};

router.get('/xtkey', handleErrorAsync(async(req, res, next)=>{
	let returnVar=req.app.xtKey.value;
	//console.log(returnVar);
	return res.send({xtKey:returnVar});
}));

router.get('/xtkey/up', handleErrorAsync(async(req, res, next)=>{
	let returnVar=req.app.xtKey.up();
	//console.log(returnVar);
	return res.send({xtKey:returnVar});
}));

router.get('/test', handleErrorAsync(async(req, res, next)=>{
	let resVar=await req.app.xtDbModel.get();
	return res.send(resVar);
}));

router.get('/model', handleErrorAsync(async(req, res, next)=>{

	return res.send({x:await req.app.xtDbModel.get()});
}));

let middlewareArr=[async(req,res,next)=>{
		console.log("MIDDLEWARE 1 => INIT FUNCT");
		let clientXtKey=req.headers.xtkey||null;
		let serverXtKey=req.app.xtKey.value;
		
		console.log("	clientXtKey",clientXtKey);
		console.log("	serverXtKey",serverXtKey);
		
		if(clientXtKey!=serverXtKey)return res.send({xtKey:serverXtKey})
		next();
	},
	(req,res,next)=>{
		//console.log("MIDDLEWARE 2 => AUTH");
		next();
	},
];

router.use(middlewareArr,(req,res,next)=>{next()});

/*
router.get('/:fileName?', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let fileName=params.fileName;
	console.log("FileName : ",fileName);
	fs.readFile("localDb/1"+fileName, (err, data) => {
	  if (!err && data) {
		let resVar=req.app.pStore.getItem(fileName);
		return res.send(resVar);
	  }else{
		  return res.send(null);
	  };
	});
	//console.log("test",req.app.localDb.getItem(fileName))
}));
*/

router.get('/:fileName?', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let fileName=params.fileName;
	let resVar=await req.app.xtDbModel.get();
	return res.send(resVar);
}));

router.delete('/:fileName/', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let fileName=params.fileName;
	if(!!fileName){
		await req.app.xtDbModel.delete();
		res.send({xtKey:req.app.xtKey.up()});
	}else res.send(null);
}));

router.post('/:fileName/', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let fileName=params.fileName;
	let body=req.body;
	///console.log(body);
	//await req.app.pStore.setItem(fileName,JSON.stringify(body));
	await req.app.xtDbModel.set(JSON.stringify(body));
	res.send({xtKey:req.app.xtKey.up()});
	//res.send(await req.app.pStore.getItem(fileName));
}));


module.exports = router;