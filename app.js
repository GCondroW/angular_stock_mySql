const httpsOptions = {
  key: `-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEAzr2ebGcYiBio4cgT5eYIUnISXPTLhDyTfJ+UCSEZE62FjakN
IAhQhACyU0wgxnqGIEMLJrV6kClD3xomBGxgJeTxrYepI1SuwuG6V4DIZNLR5YI9
JrdENdgDrMGbgebg3pgn9ybMYPXEAOpnOniZ966lM+jHnopqnlVWMqQdXg/5Lhdo
oyPew4Fr4o+uVRjRrp3r+y4IzAVV4rvNTO49SqVDEBQ1z2ItNUUB1x0xyTTFBBd/
ZKFzHFS2JG9aaZN+x+apV+IGyOnTpqqXPhykEXShqWSDA2H3ZgYLr/p9c8E2lESW
ZfZgmmacNSneRAPUHn/LUBxTyBn0u6sFaKcjKQIDAQABAoIBAQChVxewj5B0fZIm
iacFrkxmUwGDq8K70y5ifoLf0QWp9qwYToqgqfxz17tTCEE3w9yyhr/IGK6qnJmM
HfL3VsB+Mjpta0aS/P5ZtiFfMnCxRllp3AbvFOzVfFv50SoT6WMqM+JUneG39XRe
JpAi8IVv5sqkRRCr6GemYwCfCrakdTgJSY+NFpYX9TPi3Jo4vsOxu1zgsIxdSJrA
QR1VfKLmFlEopbHnxNNY39CwHtSmQ5pLto3+YQv5HY9LmV9uI1dquqL6tsZE0NCC
5dFJOnQDihBv60l2seOZojVMmnFYZVIkRBIWq8rnftbRu2C/k8vWiclAnIpCI1fb
BUJMIvcRAoGBAP1XAr1fDPdrUnE5tTWXmsFnImINPvs5UIhN6ZaGTavdAUI+9Z6j
T3Khf0sq6ruOMykMV88X/Bs8+aQdEIl4zglPXXph2wBQ34aNmp7MIM9HmSerlwGr
2kw9P6k1eSHDnQjcQX3s2SbwcU5KtPAUSm46KdSic9Wyl3Pi2vzLt4RNAoGBANDp
WO2anyoF+9XBLp3adCAvD6E79JqM4+IqBagCb8YTg0MEpox+TYbCEPTiggNxE/8H
EORyHGT18oVkVPcnbRnm8beZ3+sYt6knOdg0lD0cUMXMRVtpSEJN1KkM37MjRtP/
3kOmmT7fgIRvwkvOpa9Mkxw94Q8WHg95K1hbUbhNAoGAH3814/1xS0GYmmMmWGdk
4i7EY5RqBCn4DTpClGhWN8veYDIbr4F2WzYg8WOAk5j2W2AheqnsuiY2k2TZrX3L
f/TSFmkcJUnowH3Sf3O5kIvCSuBWgeqv1VK4G31+degwGe3oZpOP2/uA2s8G9+JN
7q5kjP81j5gIpGvL9ioNwvECgYEAm8q4l5BsS6FkuXYz9mHXobyWsk2MzshslNdz
mmQeyJ76jzrjnPf/hpQoowZboIduOwwg68uxIxVKw3Eb76hGMz/HWHz2wFKRfCKV
f4dOWPhJwAfiXRX5XgC+q0a/d87B3gz8yoRt2bZBGAJj6bZ0VnMLbc8zi9WZmz5o
NZ78JS0CgYEA2aiwV/1ZkMNk/4+exju1rFbq4uuFrUtCn0q4slmrdF9pxcF13VxY
EXoKwQYHkpyjie8UzyvIcdJJXCaQfZgBEezCEHLoNSmVsNerS5k3u2OBMBXUm+yR
XYJAdCs/lF7xDQIFdfdtnoZObMjbgUvkehVN+Nca66hj5FJxDGZosms=
-----END RSA PRIVATE KEY-----`,
  cert: `-----BEGIN CERTIFICATE-----
MIIE+DCCA+CgAwIBAgISA78kldKeiCz/txhWVObN0r/+MA0GCSqGSIb3DQEBCwUA
MDIxCzAJBgNVBAYTAlVTMRYwFAYDVQQKEw1MZXQncyBFbmNyeXB0MQswCQYDVQQD
EwJSMzAeFw0yNDAzMTAxOTI0NDNaFw0yNDA2MDgxOTI0NDJaMBgxFjAUBgNVBAMT
DWN3dGVzdC5iaXouaWQwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQDO
vZ5sZxiIGKjhyBPl5ghSchJc9MuEPJN8n5QJIRkTrYWNqQ0gCFCEALJTTCDGeoYg
QwsmtXqQKUPfGiYEbGAl5PGth6kjVK7C4bpXgMhk0tHlgj0mt0Q12AOswZuB5uDe
mCf3Jsxg9cQA6mc6eJn3rqUz6MeeimqeVVYypB1eD/kuF2ijI97DgWvij65VGNGu
nev7LgjMBVXiu81M7j1KpUMQFDXPYi01RQHXHTHJNMUEF39koXMcVLYkb1ppk37H
5qlX4gbI6dOmqpc+HKQRdKGpZIMDYfdmBguv+n1zwTaURJZl9mCaZpw1Kd5EA9Qe
f8tQHFPIGfS7qwVopyMpAgMBAAGjggIgMIICHDAOBgNVHQ8BAf8EBAMCBaAwHQYD
VR0lBBYwFAYIKwYBBQUHAwEGCCsGAQUFBwMCMAwGA1UdEwEB/wQCMAAwHQYDVR0O
BBYEFNOwXGvcOUYo91FFS1uYwCOF9xSGMB8GA1UdIwQYMBaAFBQusxe3WFbLrlAJ
QOYfr52LFMLGMFUGCCsGAQUFBwEBBEkwRzAhBggrBgEFBQcwAYYVaHR0cDovL3Iz
Lm8ubGVuY3Iub3JnMCIGCCsGAQUFBzAChhZodHRwOi8vcjMuaS5sZW5jci5vcmcv
MCkGA1UdEQQiMCCCDyouY3d0ZXN0LmJpei5pZIINY3d0ZXN0LmJpei5pZDATBgNV
HSAEDDAKMAgGBmeBDAECATCCAQQGCisGAQQB1nkCBAIEgfUEgfIA8AB2ADtTd3U+
LbmAToswWwb+QDtn2E/D9Me9AA0tcm/h+tQXAAABjioKBLUAAAQDAEcwRQIgMM9j
tsU4bcx/FHuNxNi8bWbVLB+wFY16g3ai9Z4INN4CIQDQ7Ax0p0xAuj3OJRoVjA7t
cvxrDNBavCR/c+6LFafALgB2AO7N0GTV2xrOxVy3nbTNE6Iyh0Z8vOzew1FIWUZx
H7WbAAABjioKBLgAAAQDAEcwRQIhAIYJSXv0ikWLbS4yHjO7882Dzb/ylTriWht3
GwTnAOXDAiA892/I5WLtFfoI2W7sa2f7vDHig+A1sDGqM8kd2QypIzANBgkqhkiG
9w0BAQsFAAOCAQEArmath1X1eyP5JyBQwK1WKQ4mD/dGEddaru7HIormkXJbtp+6
e/msCjcV+Te4LZomiuxRsOMOAs+/TfedrQmmZGa8fGLVCGI7tVvSwt8PH2PJE21j
mSsbc8SsoJrEMkbNkBeIsv8B5QFwvobMdBRracqEEg6NJVesmlRSGzZWBipmcaiG
c0WIfN/+IzwL2PrFHESg0B1X3c6tflsbVq/ZOoWuRYIFpt+17bl3TenJMJiLKyS3
BsQmVn1/MfNWseUX6wrSrK4Pu80T7eCNmpvfLxtC7ff034XMW349jgJPOdQszn+2
oNhsDVi18KbDmmy//+ldUXlEQn8CL6+W+jBrfA==
-----END CERTIFICATE-----`,
};
const originArr=[
	"https://cwtest.biz.id",
	"http://localhost:4200",
	"https://localhost:2125",
	"https://gcondrow.github.io",
	"http://192.168.1.111:3420",
];
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var { createServer } = require("http");
var https = require('https');
var fs = require(`fs`);

var LocalStorage = require('node-localstorage').LocalStorage;
var localDb=new LocalStorage("./localDb",Number.MAX_VALUE);

let pStore={};
let pStoreInit = async()=>{
	const pStore = require('node-persist');//persistent storage
	const pStoreOptions={
		dir: 'localDb/1',
		stringify: JSON.stringify,
		parse: JSON.parse,
		encoding: 'utf8',
		// can also be custom logging function
		logging: false,  

		// ttl* [NEW], can be true for 24h default or a number in MILLISECONDS or a valid Javascript Date object
		ttl: false,
		// every 2 minutes the process will clean-up the expired cache
		expiredInterval: 2 * 60 * 1000, 
		// in some cases, you (or some other service) might add non-valid storage files to your
		// storage dir, i.e. Google Drive, make this true if you'd like to ignore these files and not throw an error
		forgiveParseErrors: false,
		// instead of writing to file immediately, each "file" will have its own mini queue to avoid corrupted files, keep in mind that this would not properly work in multi-process setting.
		writeQueue: true, 
		// how often to check for pending writes, don't worry if you feel like 1s is a lot, it actually tries to process every time you setItem as well
		writeQueueIntervalMs: 1000, 
		// if you setItem() multiple times to the same key, only the last one would be set, BUT the others would still resolve with the results of the last one, if you turn this to false, each one will execute, but might slow down the writing process.
		writeQueueWriteOnlyLast: true, 
	}
	await pStore.init(pStoreOptions);
	return pStore;
	
};



var usersRouter = require('./routes/users');
var stockRouter = require('./routes/stock');
var transaksiRouter = require('./routes/transaksi');
var agRouter = require('./routes/ag');
var nmRouter = require('./routes/notaMasuk');
var dbRouter = require('./routes/db');
var xtRouter = require('./routes/xt');
var mySqlDb=require("./db/mysql")

var app = express();
const httpsServer = https.createServer(httpsOptions,app);
const { Server } = require("socket.io");
let corsOptions={
	credentials: true,
	origin:originArr,
};
app.use(cors(corsOptions));
const io = new Server(httpsServer, { 
	cors:{
		credentials: true,
		origin:originArr,
	},
	connectionStateRecovery: {
		maxDisconnectionDuration: 2 * 60 * 1000,
	},
});
class idPrototype{
	constructor(path){
		this.key=path;
		if(!this.getValue()){
			localDb.setItem(this.key, '1');
			this.value=this.getValue();
		}else{
			this.value=this.getValue();
		};
	};
	up=()=>{
		this.value=(Number(localDb.getItem(this.key))+1).toString();
		localDb.setItem(this.key, this.value);
		return this.value;
	};
	getValue=()=>{
		this.value=localDb.getItem(this.key);
		return this.value;
	};
	resetValue=()=>{
			localDb.setItem(this.key, '1');
			this.value=this.getValue();
			return this.value;
	};
	clearValue=()=>{
		localDb.clear(this.key);
		delete(this.value);
		return this.value;
	};
};

class inMemoryIdPrototype{
	constructor(){
		this.value=1;
	};
	up=()=>{
		//this.value=this.value++;
		console.log("inMemoryIdPrototype up()",this.value++);
		return this.value;
	};
	getValue=()=>{
		return this.value;
	};
	resetValue=()=>{
			this.value=1;
			return this.value;
	};
	clearValue=()=>{
		delete(this.value);
		return this.value;
	};
}

let cc=0;
let dbKey=-1;
let xtKey=-1;
class intervalFunct{
	constructor(x,y){
		this.count=new idPrototype("updateCount");
		this.main(x,y)
	};
	main=(x,y)=>{
		setTimeout(()=>{
			setInterval(()=>{
				x().then(x=>console.log("DB UPDATE ITERATION : ",this.count.up()));
			},y);
		},y);
	};
};
let dbParity={};
let tableViewCache=new class tableViewCache{
	constructor(){
		let init = async()=>{
			if(!(fs.existsSync("loc"))){
				console.log("- devMode ? false : > CLEAR CACHE",localDb.clear("localTableViewCache"));
			}else console.log("- devMode ? true : > USE CACHE");
			console.log("> INIT CACHE");
			let localTableViewCache=await this.getData();
			if(!!localTableViewCache){
				this.data=localTableViewCache;
			}else{
				await this.getView();
			};
			let portNumber=process.env.PORT || '2125';
			//console.log();
			pStore=await pStoreInit();
			httpsServer.listen(portNumber,()=>{
				console.log("> START SERVER");
				console.log("	-portNumber = ",portNumber);
				dbKey=new inMemoryIdPrototype();
				xtKey=new inMemoryIdPrototype();
				//new intervalFunct(this.getView,1000*60*5);
				
			});
		};
		init();
	};
	delete=async(idArr)=>{//delete using ID_DAFTAR
		console.log("> tableViewCache>delete>idArr>",idArr);
		let data=await this.getData();
		//let data=this.data;
		idArr.map(id=>{
			Object.keys(data).map(key=>{
				let index=data[key].findIndex(x=>x.ID_DAFTAR===id);
				data[key].splice(index,1);
			});
		});
		this.data=data;
		localDb.setItem('localTableViewCache',JSON.stringify(data));
		return idArr;
	};
	deleteTransaksi=async(idArr)=>{
		console.log("tableViewCache>deleteTransaksi>idArr>",idArr);
		let data=await this.getData();
		let key="transaksi";
		idArr.map(id=>{
			let index=data[key].findIndex(x=>x.ID_TRANSAKSI===id);
			data[key].splice(index,1);
		});
		this.data=data;
		localDb.setItem('localTableViewCache',JSON.stringify(data));
		return idArr;
	};
	addStock=async(newData)=>{
		console.log("tableViewCache>addStock>newData>",newData);
		let data=await this.getData();
		Object.keys(newData).map(pointer=>{
			newData[pointer].map(item=>data[pointer].push(item));
		});
		this.data=data;
		localDb.setItem('localTableViewCache',JSON.stringify(data));
		return newData;
	};
	editStock=async(updatedData)=>{
		console.log("tableViewCache>editStock>updatedData>",updatedData);
		let data=await this.getData();
		let dataIndex
		updatedData.map(item=>{
			dataIndex=data.stock.findIndex(x=>x.ID_DAFTAR===item.ID_DAFTAR);
			console.log("dataIndex = ",dataIndex);
			console.log("data.stock[dataIndex]",data.stock[dataIndex]);
			console.log("updateData",item);
			data.stock[dataIndex]=item;
		});
		console.log("dataIndex =>",dataIndex);
		this.data=data;
		localDb.setItem('localTableViewCache',JSON.stringify(data));
		return updatedData;
	};
	addTransaksi=async(newData)=>{
		console.log("tableViewCache>adTransaksi>newData>",newData);
		let data=await this.getData();	
		newData.map(item1=>{
			let changedStockDataIndex=data.stock.findIndex(item2=>item2.ID_DAFTAR===item1.ID_DAFTAR);
			if(changedStockDataIndex>=0){
				//if index found => if data is already exist
				data.stock[changedStockDataIndex].STOCK+=item1.JUMLAH;
			}else{
				//data is new
				//data.stock[changedStockDataIndex].STOCK+=item1.JUMLAH;
				let newDataTemp={
					ID_DAFTAR:item1.ID_DAFTAR,
					NAMA:item1.NAMA,
					SUPPLIER:item1.SUPPLIER,
					QTY:item1.QTY | "",
					STN:item1.STN | "",
					KATEGORI:item1.KATEGORI,
					STOCK:item1.JUMLAH, 
				};
				data.stock.push(newDataTemp);
			};
			
			data.transaksi.push(item1);
		});
		this.data=data;
		localDb.setItem('localTableViewCache',JSON.stringify(data));
		return newData;
	};	
	getData=async()=>await JSON.parse(localDb.getItem('localTableViewCache'),(key,value)=>{
		if(key==="STOCK"){
			return Number(value)
		}else return value;
	});
	getView=async()=>{
		let temp={};
		temp['stock']=await mySqlDb.singleQ("select * from "+"stock"+"_view_1");
		temp['transaksi']=await mySqlDb.singleQ("select * from "+"transaksi"+"_view_1");
		localDb.setItem('localTableViewCache',JSON.stringify(temp));
		
		this.data=temp;
		return temp;
	};

	test=async()=>{
		let localTableViewCache=await localDb.getItem('localTableViewCache');
		let temp={};
		temp['stock']=await mySqlDb.singleQ("select * from "+"stock"+"_view_1");
		temp['transaksi']=await mySqlDb.singleQ("select * from "+"transaksi"+"_view_1");
		let data={
			localTableViewCache:localTableViewCache.valueOf(),
			temp:JSON.stringify(temp).valueOf(),
		};
		return {
			bool:data.localTableViewCache===data.temp,
			data:data,
			length:{
				localTableViewCache:data.localTableViewCache.length,
				temp:data.temp.length,
				localTableViewCacheTrimmed:data.localTableViewCache.trim().length,
				tempTrimmed:data.temp.trim().length,
			},
		};
		//return data;
	};
};
app.use((req,res,next)=>{
	req.app.io=io;
	req.app.tableViewCache=tableViewCache;
	req.app.dbKey=dbKey;
	req.app.xtKey=xtKey;
	req.app.pStore=pStore;
	req.app.localDb=localDb;
	next();
});
app.use(logger('dev'));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('*.*',express.static(path.join(__dirname + '/dist/')));
app.use('/key/:c?',function(req, res, next) {
	let debug=true;
	if (debug===true){
		let c=req.params.c;
		console.log("KEY C =>",c);
		if(c==="up")dbKey.up();
	};
	res.json(dbKey);
});

app.use('/clearCache',function(req, res, next) {
	res.json([localDb.clear('dbKey')]);
});
app.use('/dbKey/',async function(req, res, next) {
	res.json({
		"req.app.dbKey":req.app.dbKey,
		dnKey:dbKey,
		localDb:await localDb.getItem("dbKey"),
	});
});
let middlewareArr=[async(req,res,next)=>{
		console.log("MIDDLEWARE 1 => INIT FUNCT");
		next();
	},
	(req,res,next)=>{
		console.log("MIDDLEWARE 2 => AUTH");
		let clientDbKey=req.get('dbKey');
		console.log("clientDbKey | dbKey => ",clientDbKey+" | "+dbKey.value);
		if(clientDbKey=!dbKey.value){
			//console.log("AUTH FAIL ",next(createError(401)));
			io.emit('login');
			console.log("AUTH FAIL ");
			res.status(202);
		}else{
			console.log("AUTH SUCCESS ",next());
		};
	},
];
app.use("/nm", nmRouter);
app.use("/db", dbRouter);
app.use("/users", usersRouter);
app.use('/ag', agRouter);
app.use('/xt', xtRouter);

app.get('/:path?',(req,res,next)=>{
	//res.json({path:req.params.path});
	let path=req.params.path;
	console.log("path",path);
	if(!path)res.redirect('/ag');
	next()
});
app.get('/test/set',async(req,res,next)=>{
	console.log("/test/set")
	let a=await pStore.setItem('xtKey',xtKey);
	//let a=await pStore.getItem('fibonaci')
	console.log(a);
	res.send(a);
});

app.get('/test/get',async(req,res,next)=>{
	console.log("/test/get")
	let a=await pStore.getItem('xtKey')
	//console.log(pStore);
	res.send(a);
});

app.get('/test/clear',async(req,res,next)=>{
	console.log("/test/clear")
	let a=await pStore.clear('XtKey')
	res.send(a);
});

app.get('/tableviewcache',(req,res,next)=>{
	console.log("tableViewCache",tableViewCache.data);
	res.send(tableViewCache.data);
});
app.get('/tableviewcache/reset',async(req,res,next)=>{
	let temp=await tableViewCache.getView();
	console.log("tableViewCache",temp);
	res.send(temp);
});
app.use(middlewareArr,(req,res,next)=>{
	console.log("middleware");
	next();
});
app.use('/stock', stockRouter);
app.use('/transaksi', transaksiRouter);
//app.use('/stock/key', (req,res,next)=>res.json({id:12}));
//app.use('/', (req,res,next)=>res.redirect('/stock'));
app.use('/dbParity/',function(req, res, next) {
	let debug=true;
	if (debug===true){
	};
	res.json(dbParity);
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});
// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	res.status(err.status || 500);
	let temp={
		messagge:err.message,
		stack:err.stack,
		status:res.status,
	};
	console.log("Error App Level: ",temp)
	res.json({Error:temp});
});
io.on('connection', socket => {
	console.log("> SOCKET CONNECTED");
	console.log("	-socket.id = ",socket.id)
	socket.on("login",(clientData,cb) => {
		console.log("	-clientData = ",clientData);
		console.log("	-dbKey.value = ",dbKey.value);
		console.log("> LOGIN VALIDATION = ",clientData.dbKey," : ",dbKey.value);
		if(clientData.dbKey!=dbKey.value){
			console.log("> LOGIN FAILED");
			cb({success:false,dbKey:dbKey.value});
		}else{
			console.log("> LOGIN SUCCESS");
			cb({success:true,dbKey:dbKey.value});
		};
	});
});
module.exports = app,io;

/*
nota
	id_nota 		int primary key auto increment
	tanggal_masuk	date
	no_nota			string
	no_surat_jalan	string
	pajak			string
	id_entry		int

	let tanggal_masuk=body.tanggal_masuk;
	let no_nota=body.no_nota;
	let no_surat_jalan=body.no_surat_jalan;
	let pajak=body.pajak;
	let id_entry=-1;
	let id_daftar=body.id_daftar;
	let ctn=body.ctn;
	let diskon_1=body.diskon_1;
	let diskon_2=body.diskon_2;
	let diskon_3=body.diskon_3;
	let diskon_dll=body.diskon_dll;
	
body=

	{
		"tanggal_masuk"
		"no_nota"
		"no_surat_jalan"
		"pajak"
		"entry":[{
			"id_daftar"
			"ctn"
			"diskon_1"
			"diskon_2"
			"diskon_3"
			"diskon_dll"
		}]
	}

entries
	id_entry		int primary key auto increment	
	id_daftar		int join table daftar
		nama		
		harga		
		qty			
		stn		
	id_nota			int join table nota
	ctn				int
	diskon_1		dec
	diskon_2		dec
	diskon_3		dec
	diskon_dll		dec



<minor bug>
+deleteAll routing issues
	expected=>stock
	observed=>daftar
	rep=>do delete all funct from mainOffcanvas ui
+inconsistent transaction table column length format
	expected=>auto adjust
	observed=>didnt adjust, short, inconsistent
	rep=>expand transaction modal
+filter resets after db operation
	expected=>filter persist
	observed=>reset to default
	rep=>do any db operations
-fixing post transaksi message(undefined)
-edit modal form didnt neet to click.selectall
</minor bug>

<improvement>
+Close button for offCancass
	Accessibility
+Persistent server localStorage (API server)
	Store var that could be persisted such as dbKey in case server offline mid runtime 
-Better ag-grid (table) ui solution
	as of now table is auto adjusting length everytime rowData is updated, caused issue when doing navigation throught pagination
-create means of resetting client localstorage somehow
-creating user priviledges
-search button navigation improvement for responsive layout 
-empty table indicator
</improvement>

<hosting>
	my.hostnic.id/
	cwtest.biz.id 
</hosting>

*/
