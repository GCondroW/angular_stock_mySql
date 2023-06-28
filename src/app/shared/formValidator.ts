import { AbstractControl } from '@angular/forms';

let regex={
	number:"(\-*\d)",
}

export function ValidateForm(control: AbstractControl) {
	let data=control.value;
	let pattern=RegExp(regex.number)
	if (pattern.test(data))return { invalidUrl: true };
	return null;

}
