const mysql = require('mysql2/promise');
const config = require('./config');

let old_preSttQ=async(stt,values)=>{
	const connection = await mysql.createConnection(config);
	let [rows, fields]=[];	
	let iteration=1;
	try {
		await connection.beginTransaction();
		for (const v of values) {
			console.log("iteration : ",iteration);
			console.log("query : ",stt);
			[rows, fields][iteration]=(await connection.execute(stt,v));
			iteration++;
		};
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
};

let preSttQ=async(stt,values)=>{
	const connection = await mysql.createConnection(config);
	let [rows, fields]=[];	
	let iteration=1;
	try {
		await connection.beginTransaction();
		[rows, fields]=(await connection.execute(stt,values));
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

let singleQ=async(sql)=>{
	const connection = await mysql.createConnection(config);
	console.log("query : ",sql);
	try{
		const [rows, fields] = await connection.query(sql);
		await connection.end();
		return rows;
	}catch(e){
		await connection.end();
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
	}finally{
		console.log("FINALLY");
		
	};
	//console.log(rows);
	
	return rows;
};

/*
let OLD_multQ=async(qArr)=>{
	let [rows, fields]=[];	
	let iteration=1;
	//pool.getConnection(async(err,conn)=>{
		try {
			conn.beginTransaction();
			for (const q of qArr) {
				console.log("iteration : ",iteration++);
				console.log("query : ",q);
				[rows, fields]=await (conn.query(q));
			};
		}catch(error){
			console.log("ERROR",error);
			await conn.rollback();
		}finally{
			console.log("FINALLY");
			await conn.commit();
		};
		//await pool.releaseConnection(conn)
	});
	return await rows;
};
*/

async function doStuff(items) {
  try { 
	//const connection = await mysql.createPool(config);
    const connection = await pool.getConnection();
	console.log("connection	",connection);
    await connection.beginTransaction();
    for(const item of items) {
		console.log("items : ",items);
      await connection.query(items);
    }
    await connection.commit();
  } catch (e) {
    await connection.rollback();
    throw e;
  } finally {
    await pool.release();
  }
}
module.exports = {
  preSttQ,singleQ,multQ,config
}