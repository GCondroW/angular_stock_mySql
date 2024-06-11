export class localDbModel{
	public key:string="";
	public href:string="";
	public value:string="";
	constructor(href:string,key:string){
		this.key=key;
		this.href=href;
		this.value=this.get()
		console.log(this);
	};
	public set = (value:string)=>{
		let temp=JSON.parse(localStorage.getItem(this.href)||"{}");
		let assignedObject=Object.assign(temp,{[this.key]:value});
		localStorage.setItem(this.href,JSON.stringify(assignedObject));
		this.value=this.get();
		return this.value;
	};
	public get = ()=>{
		let temp=JSON.parse(localStorage.getItem(this.href)||"{}");
		if(!!temp)return temp[this.key]||null;
		return null;
	};
	
	public delete = ()=>{
		let temp=JSON.parse(localStorage.getItem(this.href)||"{}");
		let assignedObject=Object.assign(temp,{[this.key]:"{}"});
		localStorage.setItem(this.href,JSON.stringify(assignedObject));
		this.value=this.get();
		return this.value;
	};
};