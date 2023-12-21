var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var { createServer } = require("http");
var stockRouter = require('./routes/stock');
var transaksiRouter = require('./routes/transaksi');
var agRouter = require('./routes/ag');

let portNumber=3420;
let originArr=[
	"http://localhost:4200",
	"http://localhost:3420",
	"https://gcondrow.github.io",
	"http://192.168.1.111:3420"
];

var app = express();

const httpServer = createServer(app);
const { Server } = require("socket.io");
const io = new Server(httpServer, { 
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
		let LocalStorage=require('node-localstorage').LocalStorage;
		this.db=new LocalStorage("./db/localDb");
		if(!this.getValue()){
			this.db.setItem(this.key, '1');
			this.value=this.getValue();
		}else{
			this.value=this.getValue();
		};
	};
	up=()=>{
		this.value=(Number(this.db.getItem(this.key))+1).toString();
		this.db.setItem(this.key, this.value);
		return this.value;
	};
	getValue=()=>{
		this.value=this.db.getItem(this.key);
		return this.value;
	};
	clearValue=()=>{
		this.db.clear(this.key);
		delete(this.value);
		return this.value;
	};
};

let dbKey=new idPrototype("dbKey");
let userId=new idPrototype("userId");
let dbParity={};
let corsOptions={
	credentials: true,
	origin:originArr,
};
let tableViewCache=new class tableViewCache{
	constructor(){
		this.db=require("./db/mySql")
		this.getView().then(x=>{
			console.log("isReady");
			this.data=x;
		});
	};
	getView=async(dbName)=>{
		let temp={};
		temp['stock']=await this.db.singleQ("select * from "+"stock"+"_view_1");
		temp['transaksi']=await this.db.singleQ("select * from "+"transaksi"+"_view_1");
		return temp;
	};
};
app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json({limit:'8mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/*app.get('/home', function(req, res,next) {
	try{
		console.log("AT /home")
		console.log("=>",path.join(__dirname + '/dist/app-angular-json-server/'))
		res.sendFile(path.join(__dirname + '/dist/app-angular-json-server/index.html'));
	}catch(e){
		
	};
});*/
//app.use(express.static(path.join(__dirname + '/dist/app-angular-json-server/')));
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
let middlewareArr=[async(req,res,next)=>{
		console.log("MIDDLEWARE 1 => INIT FUNCT");

		next();
	},
	(req,res,next)=>{
		console.log("MIDDLEWARE 2 => AUTH");
		let clientDbKey=req.get('dbKey');
		console.log("clientDbKey | dbKey => ",clientDbKey+" | "+dbKey.value);
		if(clientDbKey!=dbKey.value){
			//console.log("AUTH FAIL ",next(createError(401)));
			io.emit('login');
			console.log("AUTH FAIL ");
			//throw new Error ("AUTHENTICATION_FAILED");
		}else{
			console.log("AUTH SUCCESS ",next());
		};
	},
];

app.use((req,res,next)=>{
	req.app.io=io;
	console.log("test))394012");
	req.app.dbKey=dbKey;
	next();
})

app.use('/ag', agRouter);
app.get('/:path?',(req,res,next)=>{
	//res.json({path:req.params.path});
	let path=req.params.path;
	console.log("path",path);
	if(!path)res.redirect('/ag');
	next()
});
app.get('/tableView',(req,res,next)=>{
	console.log("tableViewCache",tableViewCache.data);
	res.send(tableViewCache.data);
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
	console.log(" ")
	console.log("====================================================")
	console.log("SOCKET CONNECTED = > ",socket.id);
	socket.on("login",(clientData,cb) => {
		console.log("CLIENTDATA = >",clientData);
		console.log("DBKEY = >",dbKey.value);
		console.log("LOGIN VALIDATION = >",clientData.dbKey,dbKey.value);
		if(clientData.dbKey!=dbKey.value){
			console.log("LOGIN FAILED");
			cb({success:false,dbKey:dbKey.value});
		}else{
			console.log("LOGIN SUCCESS");
			cb({success:true,dbKey:dbKey.value});
		};
	});
});

httpServer.listen(portNumber,()=>{
	console.log("Start, port :",portNumber);
});

module.exports = app,io;
/*
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
</minor bug>

<improvement>
-Close button for offCancass
	Accessibility
+Persistent server localStorage (API server)
	Store var that could be persisted such as dbKey in case server offline mid runtime 
-Better ag-grid (table) ui solution
	as of now table is auto adjusting length everytime rowData is updated, caused issue when doing navigation throught pagination
</improvement>

<hosting>
	my.hostnic.id/
	cwtest.biz.id 
</hosting>

*/
