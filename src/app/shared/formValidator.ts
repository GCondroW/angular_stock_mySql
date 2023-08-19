import { AbstractControl } from '@angular/forms';

let regex={
	number:"(\-*\d)",
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