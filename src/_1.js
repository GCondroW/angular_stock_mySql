let dbPath="src/assets/db.json"

module.exports = (req, res, next) => {
	//res.header('X-Hello', 'World')
	let method=req.method;
	let isDelete=!!(method==="DELETE");
//	if(isDelete)return doThisWhenDeleting(req,res,next);
	return next()
}

doThisWhenDeleting=(req,res,next)=>{
	//let data=req.body;
	let hostname=req.hostname;
	let originalUrl=req.originalUrl;
	let path=req.path; // <------
	let param=req.param('id');
	//let params=req.params;
	//console.log("deleteData",data);
	console.log("hostname",hostname);
	console.log("originalUrl",originalUrl);
	console.log("path",path);
	console.log("do delete : ","deleteParam",param);
	//console.log("deleteParams",params);
	
	let isWipe=!!(param<0);
	console.log("isWipe",isWipe);
	
	let dbName=String(path).split("/")[1];
	if(isWipe)return doThisWhenWiping(dbName,res)
	return next();
}

doThisWhenWiping=async(dbName,res)=>{
	const fs = require('fs');
	const { finished } = require('node:stream');
	fs.readFile(dbPath,'utf8',(e,data)=>{
		if(e){
			console.log(e);
			return
		}else{
			const stream = fs.createWriteStream(dbPath);
			let temp=JSON.parse(data);
			temp[dbName]={"":null};
			stream.write(JSON.stringify(temp));
			console.log("45",temp);
			stream.on('finish', () => {
				console.log('All writes are now complete.');
				return res.json(temp[dbName])
			});
			stream.end();
		}
	})
}