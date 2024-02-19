const httpsOptions = {
  key: `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA2a24PUUQtYjCJ3KiTvYFfN4c47hW6UBCY28mJByPhLf3/wp2
YzoDkI8i+1gOTHOQK6bT3bXIVvshtuQmgb461MU7MDu+2rWdt4k8N+gXkE5haZuL
SJ1exhGpFrygwLD4E1bYhWCv8OB7X5xXBCt2GvR/Y9r6D2mzZ3NkcngVL5Omk5sI
sjE9A6B2U7R28tZyd6VgFM975uh/DQo9C0On8X6xJZ5WS5rwzAJwvY/B+lcSOFoh
wtoz9stFmscfxjgVqt0tQwvm4Vo9ejuicbM+cx3Eojqepd2tO/4n/Ko2rjjhIxv8
6wjpiwz0p4USVCowMWqCUTCpjKhlxMAqzTv3sQIDAQABAoIBAQChUe49cgbNEloZ
FAqXjBpLDOzKEt5OJLJOsJvKnWP7Tr+6wk00glUL+BhLv1lxbR+GSi+vmr2rQJge
y3yCILHG55hSyaRKv9fvogP/xsBX0M6+jmit2vrWvVXbpNVZmI1w/6adSid501N7
awjN7Uus9E/IeAtkCsjLPShO8RF6XIs16udl37XtBOHNJXS3udNA8qYyhqeh5m5d
kvdvTbHFwBTcXPU0vC0039Va9cFR7vu3JkZGCP5lrWCIveZkpzpfP7hEDHjcuNLe
IWQPxqcPdnfNgaOqYckaTsFqsHNi936vtJx0lb54RtttxgYraEk5nJm8mjVBKCwd
frz8++FBAoGBAPR5eNZj7AziFDeqoqXUDu1M+Fg3bPzgnTWn9WkHJl5y5alB+ryu
OSDh3Idel6BBopu2mljMLSFZpPfp6LLW0XepiQRAVIb8fZVrKup9vUrxQWnt+db2
UaxX8I8TCspO5lkZ+5IhSNK2sdgxuo3R6/x3ehNBE5y896VHE/7V93dJAoGBAOPw
2ga+SoXub/kNrEkBOmYEZOtf+eUydqdj0eNpKp83ob2FOoBlNr/mylRP98Q9Q+fd
yJci9zMe9hsO95Jx5LDJud5+FlWwSBV4r8FFXYOFqzZ3lqbeihfGwNF6HlsHb9Qf
5oFky/LEKCd1AjRXlAuKuUyERy+c4I6er0YS6fUpAoGAIAZdjvAN9u4SqewfXEu4
HNvNWHkCPOoLjgDPhA+cthik/xQWjWrhLu6HXfBFOof+jhlQhLtSWiENHDC2+95q
GBvMSBNJP1mJ9e3Q9GC+UDfkUsUKyl7/+eyXJZbf/fpx8FAYBV9406l9CI4TGwrZ
t/vKsQUAVbLnWe5Cr0pGHYkCgYACsEOSEsqEO+S8NkoS7l3G+ERMdmxXJLo7jTTb
jtD+4cQZnSmsfAUiTFGUnwDYIrTbVkVYawQpaTMT7KBE7Oz6nNaBZlFTH2oqPqss
B2pr87aqRMzVGQjd8O0zS1JyVmseQGYSnqK9MU0b8ghdn67SWAeJfIHucNZBOGPu
2qhByQKBgBsjqrmxh+xLokxNY8XNk70ke0w+6Y+bdvlnXlC1G/RXQwYezcHYAqHE
TjuWV26SHNeg7MQfimX1EiZEJi62kqiMQ+/qmcRw9qu/Hhi8V00iZEXBMDEu/riF
MM4Wn0DflqWCp/j03v/LEcxBIx1DdnWLpyTt3IRZMlx6Fps6wOEG
-----END RSA PRIVATE KEY-----`,
  cert: `-----BEGIN CERTIFICATE-----
MIIGdTCCBV2gAwIBAgIQKez5kpokTtiU9KH1wWnEnjANBgkqhkiG9w0BAQsFADBy
MQswCQYDVQQGEwJVUzELMAkGA1UECBMCVFgxEDAOBgNVBAcTB0hvdXN0b24xFTAT
BgNVBAoTDGNQYW5lbCwgSW5jLjEtMCsGA1UEAxMkY1BhbmVsLCBJbmMuIENlcnRp
ZmljYXRpb24gQXV0aG9yaXR5MB4XDTIzMTIyNjAwMDAwMFoXDTI0MDMyNTIzNTk1
OVowGDEWMBQGA1UEAxMNY3d0ZXN0LmJpei5pZDCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBANmtuD1FELWIwidyok72BXzeHOO4VulAQmNvJiQcj4S39/8K
dmM6A5CPIvtYDkxzkCum0921yFb7IbbkJoG+OtTFOzA7vtq1nbeJPDfoF5BOYWmb
i0idXsYRqRa8oMCw+BNW2IVgr/Dge1+cVwQrdhr0f2Pa+g9ps2dzZHJ4FS+TppOb
CLIxPQOgdlO0dvLWcnelYBTPe+bofw0KPQtDp/F+sSWeVkua8MwCcL2PwfpXEjha
IcLaM/bLRZrHH8Y4FardLUML5uFaPXo7onGzPnMdxKI6nqXdrTv+J/yqNq444SMb
/OsI6YsM9KeFElQqMDFqglEwqYyoZcTAKs0797ECAwEAAaOCA18wggNbMB8GA1Ud
IwQYMBaAFH4DWmVBa6d+CuG4nQjqHY4dasdlMB0GA1UdDgQWBBSjIIJBi8GzbDzR
PPBh1fMvzMZfkDAOBgNVHQ8BAf8EBAMCBaAwDAYDVR0TAQH/BAIwADAdBgNVHSUE
FjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwSQYDVR0gBEIwQDA0BgsrBgEEAbIxAQIC
NDAlMCMGCCsGAQUFBwIBFhdodHRwczovL3NlY3RpZ28uY29tL0NQUzAIBgZngQwB
AgEwTAYDVR0fBEUwQzBBoD+gPYY7aHR0cDovL2NybC5jb21vZG9jYS5jb20vY1Bh
bmVsSW5jQ2VydGlmaWNhdGlvbkF1dGhvcml0eS5jcmwwfQYIKwYBBQUHAQEEcTBv
MEcGCCsGAQUFBzAChjtodHRwOi8vY3J0LmNvbW9kb2NhLmNvbS9jUGFuZWxJbmND
ZXJ0aWZpY2F0aW9uQXV0aG9yaXR5LmNydDAkBggrBgEFBQcwAYYYaHR0cDovL29j
c3AuY29tb2RvY2EuY29tMIIBBQYKKwYBBAHWeQIEAgSB9gSB8wDxAHYAdv+IPwq2
+5VRwmHM9Ye6NLSkzbsp3GhCCp/mZ0xaOnQAAAGMpz7pEwAABAMARzBFAiBPJrJL
xvqeJdZYzpK8YY+cUCeVo0ExY0otGOhlTmVO1gIhANhEDWvZzJaGjQ/S7FliAlnd
G0BMWAtOBy6KuJThrkbSAHcAO1N3dT4tuYBOizBbBv5AO2fYT8P0x70ADS1yb+H6
1BcAAAGMpz7ovwAABAMASDBGAiEA8C2o/4yhcz0kRyIQHaRezC1ccZjLakFqDVo1
vyp074sCIQDAoDH8Ev+NBzHpP+FRWWkh0W4eLXPvj6DDGywgLM5seDCBugYDVR0R
BIGyMIGvgg1jd3Rlc3QuYml6LmlkghRjcGFuZWwuY3d0ZXN0LmJpei5pZIIZY3Bj
YWxlbmRhcnMuY3d0ZXN0LmJpei5pZIIYY3Bjb250YWN0cy5jd3Rlc3QuYml6Lmlk
ghJtYWlsLmN3dGVzdC5iaXouaWSCFXdlYmRpc2suY3d0ZXN0LmJpei5pZIIVd2Vi
bWFpbC5jd3Rlc3QuYml6LmlkghF3d3cuY3d0ZXN0LmJpei5pZDANBgkqhkiG9w0B
AQsFAAOCAQEAU03XIlDyygozUKR23dVEoRqksqUYuahDVKiA2CzWcDUcZeXWMjlI
Fgw3Fv5DrvOIlRBx0zE3K4yl5hqeJk5tE6ueWfq3V3S0lgobCM4/9nB6q2ORbnFj
NFJ9x/sOArMU4SqbqNTZ1yiI4++ymaUXF7rumFTVvUWO8yEIT+fn2fBCoTcfb/NO
O1sylIXi1Ltc4Uzcy3KEyHy1qwKNlxfYkzRml/KdTK8Yr22rw0yweRdIKf2uNWoA
tsYavHD6iYM1iNsRjI5xCKtxM9pLEeD6gVpVtqmk0v0GQiw01fmP9Ff17E1VVLEl
SGA1uPrw/RZCjQT44LCUC4hVLPwX3mb+NQ==
-----END CERTIFICATE-----`,
};
const originArr=[
	"https://cwtest.biz.id",
	"http://localhost:4200",
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
var localDb=new LocalStorage("./localDb");

var usersRouter = require('./routes/users');
var stockRouter = require('./routes/stock');
var transaksiRouter = require('./routes/transaksi');
var agRouter = require('./routes/ag');
var nmRouter = require('./routes/notaMasuk');
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
let cc=0;
let dbKey=-1;
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

			httpsServer.listen(portNumber,()=>{
				console.log("> START SERVER");
				console.log("	-portNumber = ",portNumber);
				new intervalFunct(this.getView,1000*60*5);
				dbKey=new idPrototype("dbKey");
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
	next();
});
app.use(logger('dev'));
app.use(express.json({limit:'8mb'}));
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
app.use("/users", usersRouter);
app.use('/ag', agRouter);
app.get('/:path?',(req,res,next)=>{
	//res.json({path:req.params.path});
	let path=req.params.path;
	console.log("path",path);
	if(!path)res.redirect('/ag');
	next()
});
app.get('/test',async(req,res,next)=>{

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
