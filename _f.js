module.exports = {
	localDbModel : class localDbModel{
		value = null;
		
		constructor(path,key){
			let LocalStorage = require('node-localstorage').LocalStorage;
			this.key=key+".txt";
			this.path=path;
			this.localDb=new LocalStorage(path,Number.MAX_VALUE);
			//this.set(JSON.stringify(this.get()))
			this.get().then(x=>this.set(x))
			console.log("this.value",this.value);
			console.log("localDbModel : ",this.localDb)
		};

		get = async() => {
			//console.log("get ",this.value)
			//console.log("xtDbModel.get() = >",await this.localDb.getItem(this.key),this.value)
			let temp=await this.localDb.getItem(this.key) || this.value;
			this.value=temp;
			return this.value;
		};
		set = async(value) => {	
			//console.log("setValue ",value);
			//console.log("xtDbModel.set = >",value)
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