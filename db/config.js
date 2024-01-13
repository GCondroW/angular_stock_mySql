let devMode=true;

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

module.exports = config;