import { AbstractControl } from '@angular/forms';

let regex={
	number:'^[0-9]+$',
};

export function ValidateForm(control: AbstractControl) {
	let data=control.value;
	let pattern=RegExp(regex.number);
	if (pattern.test(data))return { invalidUrl: true };
	return null;
};

export function ValidateFormNotZero(control: AbstractControl) {
	let data=control.value;
	let pattern=RegExp(regex.number);
	if (pattern.test(data)||data===0)return { invalidUrl: true };
	return null;
};

export let StockValidators={
	errMessage:{
		number:"",
		update:"",
		final:"",
	},
	number:(control: AbstractControl)=>{
		let data=control.value;
		let pattern=RegExp(regex.number);
		if (pattern.test(data))return{invalidUrl:true,message:"Hanya menerima input angka"};
		return null;
	},
	update:(control: AbstractControl)=>{
		let data=control.value;
		if (data===0)return{invalidUrl:true,message:"Tidak ada perubahan"};
		return null;
	},
	final:(control: AbstractControl)=>{
		let data=control.value;
		if (data<0)return{invalidUrl:true,message:"Stock dibawah 0"};
		return null;
	}
};

export let GlobalValidator={
	number:(control: AbstractControl)=>{
		let data=control.value;
		let pattern=RegExp(regex.number);
		if (!pattern.test(data))return{notNumber:true,message:"Hanya menerima input angka"};
		return null;
	},
	required:(control: AbstractControl)=>{
		let data=control.value;
		if (data==='')return{empty:true,message:"Kolom Kosong"};
		return null;
	},
	cantBeZero:(control: AbstractControl)=>{
		let data=control.value;
		if (data===0)return{zero:true,message:"Kolom Kosong"};
		return null;
	},
};