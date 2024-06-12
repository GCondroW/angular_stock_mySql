module.exports = {
	localDbModel : class localDbModel{
		value = null;
		
		constructor(path,key){
			let LocalStorage = require('node-localstorage').LocalStorage;
			this.key=key+".txt";
			this.path=path;
			this.localDb=new LocalStorage(path,Number.MAX_VALUE);
			this.set(JSON.stringify(this.get()))
			console.log("localDbModel : ",this.localDb)
		};

		get = async() => {
			//console.log("get ",this.value)
			let temp=await this.localDb.getItem(this.key) || this.value;
			this.value=temp;
			return this.value;
		};
		set = async(value) => {	
			//console.log("setValue ",value);
			let temp=await this.localDb.setItem(this.key,value);
			this.value=temp;
			return this.value;
		};
		delete = async()=>{
			//console.log("delete ",this.key);
			let temp = this.localDb.removeItem(this.key);
			this.value = temp;
			//console.log("value = "+this.value);
			return this.value;
		};
	},
	
};