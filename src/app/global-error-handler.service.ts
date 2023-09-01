import { Injectable, ErrorHandler } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class GlobalErrorHandlerService implements ErrorHandler{
	constructor() {}
	handleError(error: any) {
	  if (error instanceof HttpErrorResponse) {
		  //Backend returns unsuccessful response codes such as 404, 500 etc.				  
		  console.error('Backend returned status code: ', error.status);
		  console.error('Response body:', error.message);          	  
	  } else {
		  //A client-side or network error occurred.	          
		  console.error('An error occurred:', error.message);     
		  alert("Error\t:\n"+error.message);
	  }     
	}
}