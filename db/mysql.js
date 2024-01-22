const mysql = require('mysql2/promise');
const {config,poolConfig} = require('./config');
const pool = mysql.createPool(poolConfig);

let singleQ=async(sql)=>{
	//const connection = await mysql.createConnection(config);
	console.log("query : ",sql);
	try{
		const [rows, fields] = await pool.query(sql);
		//await connection.end();
		return rows;
	}catch(e){
		//await connection.end();
		throw new Error(e);
	}
};

let multQ=async(qArr)=>{
	const connection = await mysql.createConnection(config);
	let [rows, fields]=[];	
	let iteration=1;
	
	try {
		await connection.beginTransaction();
		//const queryPromises = []
		
		for (const q of qArr) {
			//queryPromises.push(connection.query(query);
			console.log("iteration : ",iteration++);
			console.log("query : ",q);
			[rows, fields]=(await connection.query(q));
			//console.log("result : ",rows);
		};
		await connection.commit();
		await connection.end()
	}catch(error){
		console.log("ERROR",error);
		await connection.rollback();
		await connection.end()
		throw new Error(error);
	}finally{
		console.log("FINALLY");
	};
	return rows;
};

let preSttQ=async(stt,values)=>{
	const connection = await mysql.createConnection(config);
	let [rows, fields]=[];	
	let iteration=1;
	try {
		await connection.beginTransaction();
		[rows, fields]=(await connection.query(stt,values));
		await connection.commit();
		await connection.end();
	}catch(error){
		console.log("ERROR",error);
		await connection.rollback();
		await connection.end();
	}finally{
		console.log("FINALLY");
		
	};
	//console.log(rows);
	
	return rows;
}

module.exports = {
  preSttQ,singleQ,multQ,config
}