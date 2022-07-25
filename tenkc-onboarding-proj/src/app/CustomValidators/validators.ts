
// Custom validator(s)

import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {

  // SYNC CannotContainSpace validator
  //use 'static' to be abel to access methods from the outside without creating an instance of the Class.
  static cannotContainSpace(control: AbstractControl) : ValidationErrors | null {
    if((control.value as string).indexOf(' ') >= 0)
      return { cannotContainSpace: true };  // Error found -- return ValidationError type response

    return null;
  }

  //  SYNC ShouldBeUnique validator
  //use 'static' to be abel to access methods from the outside without creating an instance of the Class.
  static shouldBeUniqueBasic(control: AbstractControl): ValidationErrors | null {
    if(control.value ==='nishi')
      return { shouldBeUnique: true };  // Error found -- return ValidationError type response

    return null;
  }

  // ASYNC - ShouldBeUnique validator
  // ShouldBeUnique validator
  //use 'static' to be abel to access methods from the outside without creating an instance of the Class.
  static shouldBeUniqueAsync(control: AbstractControl): Promise<ValidationErrors | null> {
    return new Promise ((resolve, reject) => { // return a promise to replicate ASYNC validation process
      setTimeout(() => {
        if(control.value === 'nishu')
          resolve({ shouldBeUniqueAsync: true });

        resolve(null);
      }, 2000);
    });
  }



}
