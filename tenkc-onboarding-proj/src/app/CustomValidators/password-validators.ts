import { AbstractControl } from "@angular/forms";


export class PasswordValidators  {

  //  SYNC Valid Old Password validator
  // use 'static' to be abel to access methods from the outside without creating an instance of the Class.
  static validOldPassword(control: AbstractControl){
    return new Promise((resolve, reject) => {
      if((control.value !== '1234'))
        resolve( { invalidOldPassword: true } );
    });
  }

    //  SYNC PasswordsShouldMatch validator (FormGroup level)  -- New password and confir password should be
    // use 'static' to be abel to access methods from the outside without creating an instance of the Class.
    static passwordShouldMatch(control: AbstractControl){
      let newPassword = control.get('newPassword');
      let confirmPassword = control.get('confirmPassword');
      // console.log(newPassword,confirmPassword);

      if(newPassword.value !== confirmPassword.value){
        return {
          passwordsShouldMatch: true
        }

        return null;
      }
    }
  }
