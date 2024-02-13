var fs = require(`fs`);
let devMode=fs.existsSync("loc");
console.log("- devMode = ",devMode)
const config=devMode?{
	host     : 'localhost',
	user     : 'root',
	password : '',//#KhUwzudxT{B
	connectTimeout: 60000,
	database : 'test',
}:
{
	host     : 'cwtest.biz.id',
	user     : 'cwtestb2_1',
	password : 'joji585jpg5u',
	connectTimeout: 60000,
	database : 'cwtestb2_mainDb',
};

const poolConfig=devMode?{
	host     : 'localhost',
	user     : 'root',
	password : '',//#KhUwzudxT{B
	database : 'test',
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
}:
{
	host     : 'cwtest.biz.id',
	user     : 'cwtestb2_1',
	password : 'joji585jpg5u',
	database : 'cwtestb2_mainDb',
	waitForConnections: true,
	connectionLimit: 10,
	maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
	idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
	queueLimit: 0,
	enableKeepAlive: true,
	keepAliveInitialDelay: 0,
};

module.exports = {config,poolConfig};