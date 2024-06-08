module.exports = {
	localDbModel : class localDbModel{
		mySql = require('./db/mysql');
		dbName = "json_db";
		value = null;
		constructor(key){
			this.key=key;
			this.value=this.get()
		};
		get = async() => {
			let key=this.key;
			let dbName=this.dbName;
			let query=`select json_value from `+dbName+` where json_key = `+"'"+key+"'";
			let returnVar=await this.mySql.singleQ(query);
			return JSON.parse(returnVar[0].json_value);
		};
		set = async(value) => {
			let key=this.key;
			//let value=value;
			let query=`
				update `+this.dbName+
				` set json_value = JSON_OBJECT(json_value,'`+value+`')`+
				` where json_key = `+"'"+key+"'";
			console.log(query);
			return await this.mySql.singleQ(query);
			//console.log(await this.mySql.singleQ(query))
		};
	},
	
};