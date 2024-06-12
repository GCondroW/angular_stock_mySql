module.exports = {
	localDbModel : class localDbModel{
		value = null;
		
		constructor(key){
			let LocalStorage = require('node-localstorage').LocalStorage;
			this.key=key;
			this.localDb=new LocalStorage("./public/"+key,Number.MAX_VALUE);
			console.log("localDbModel : ",this.localDb)
		};

		get = async() => {
			//console.log("get ",this.value)
			let temp=this.value || await this.localDb.getItem(this.key);
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