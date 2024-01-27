var express = require('express');
var router = express.Router();
var db = require('../db/mysql');
var handleErrorAsync = func => (req, res, next) => {
    func(req, res, next).catch((error) => next(error));
};
var hashCode=(str)=>{
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
router.get('/', async(req, res, next)=>{
	let resVar=await db.singleQ("select user_name from users")
	console.log("resVar = ",resVar);
	let htmlStrOut="";
	htmlStrOut+="<ul>";
	resVar.map(item=>htmlStrOut+="<li>"+item.user_name+"</li>")
	htmlStrOut+="</ul>";
	res.send(`
		<html>
			<head>
				<title>placeholder</title>
			</head>
			<body>
				`+htmlStrOut+`
			</body>
		</html>
	
	`);
});
router.post('/login/:userName', handleErrorAsync(async(req, res, next)=>{
	let userName=req.params.userName;
	let password=req.body.password;
	let temp= await db.singleQ("select * from users where user_name="+"'"+userName+"'"+" and pass_word="+"'"+password+"'")
	if (temp.length<1){
		console.log("login failed");
		res.status(200).json({auth:false});
	}else{
		let userId=temp[0].id_user;
		let userPriviledge=temp[0].priviledge;
		console.log("login success");
		res.status(200).json({auth:true,id:userId,priviledge:userPriviledge});
	};
}));
router.get('/logout/:userName', handleErrorAsync(async(req, res, next)=>{
	let userName=req.params.userName;
	let password=hashCode(req.body.password);
	let temp= await db.singleQ("select * from users where user_name="+"'"+userName+"'"+" and pass_word="+"'"+password+"'")
	res.send(temp);
}))

router.post('/:userName?', handleErrorAsync(async(req, res, next)=>{
	try{
		let userName=req.params.userName;
		let password=hashCode(req.body.password);
		let currentDate=new Date();
		
		let check=(await db.singleQ("select id_user from users where user_name="+"'"+userName+"'"+" limit 1")).length;
		console.log("check ",check);
		if(check){
			//if data exist
			return res.send("name "+userName+" exist");
		}else{
			let q="insert into users (user_name, date_created, last_activity, pass_word) values (?,?,?,?)";
			let v=[userName,currentDate,currentDate,password];
			let temp=await db.preSttQ(q,v);
			res.send(JSON.stringify(temp));
		};
		

	}catch(e){res.send("users, creating new users error "+e)};
}));


router.get('/', function(req, res, next) {
	res.status(404).send("err");
});


module.exports = router;

/*
db
	add?
		post =>
			logic => 
				var init
				Check if name exist
					next()
					err()
			db => users
			columns =>
				id_user => ai primary key, int
				user_name => req.params.name, string1
				date_created => new Date(), datetime(0 length)
				last_activity => new Date() datetime(0 length)
				passwornd => req.body.password, simple shared hash, string
*/