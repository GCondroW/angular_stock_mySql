var express = require('express');
var router = express.Router();
var app = express();
const fs = require('fs');


const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};

router.get('/:fileName?', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let fileName=params.fileName;
	console.log("FileName : ",fileName);
	fs.readFile("localDb/"+fileName, (err, data) => {
	  if (!err && data) {
		let resVar=req.app.localDb.getItem(fileName);
		return res.send(resVar);
	  }else{
		  return res.send(null);
	  };
	});
	//console.log("test",req.app.localDb.getItem(fileName))
}));

router.delete('/:fileName/', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let fileName=params.fileName;
	if(!!fileName) return res.send(req.app.localDb.removeItem(fileName));
	//return res.send(null);
}));

router.post('/:fileName/', handleErrorAsync(async(req, res, next)=>{
	try{
		let params=req.params;
		let fileName=params.fileName;
		let body=req.body;
		req.app.localDb.setItem(fileName,JSON.stringify(body));
		res.send(req.app.localDb.getItem(fileName));
	}catch(e){throw new Error(e)}
}));

module.exports = router;