var express = require('express');
var router = express.Router();
var app = express();
var db = require('../db/mysql');
const handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};

router.get('/delete/:db/', handleErrorAsync(async(req, res, next)=>{
	res.send(await db.singleQ("delete from "+req.params.db))
}));

router.get('/:n?/', handleErrorAsync(async(req, res, next)=>{
	let params=req.params;
	let query=req.query;
	console.log("params",params)
	console.log("query",query)
	let dbName=req.params.n||false;
	let colName=req.query.col||false;
	let con=req.query.con||false;
	let leftjoin=req.query.leftjoin||false;
	if(!dbName)throw new Error("db is not specified");
	if(!colName)colName="*";
	if(!con)con="1";
	if(!leftjoin)leftjoin="";
	let q="select "+colName+" from "+dbName+" "+leftjoin+" where "+con;
	res.send(await db.singleQ(q));
}));


module.exports = router;