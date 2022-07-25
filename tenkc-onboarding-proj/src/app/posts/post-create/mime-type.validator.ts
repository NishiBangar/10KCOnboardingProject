import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

// Read the file Asynchronously (async validator) --> return a promise/observable error obj
export const mimeType = (control: AbstractControl): Promise<{[key: string]: any}> | Observable<{[key: string]: any}> => {

  // Check if the image is a string and not a file
  if(typeof(control.value) === 'string'){
    return of(null); // return an observable data; if string; and is valid
  }

  // Extract the file
  const file = control.value as File;

  // Read the file
  const fileReader = new FileReader();


  // Create your own Observable and read the file
  const frObs = new Observable((observer: Observer<{[key: string]: any}>) => {

    // MIME type validation
    fileReader.addEventListener("loadend", () => {
      // Get the file type (ifValid type)  --> Unit8Array --> creates new array of 8bits unsigned integers
                                            // Access file metadata details

      // Get file MIME type
      const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4); // Create new array of 8 bit integers
      let header = "";
      let isValid = false;

      for(let i=0; i< arr.length; i++){
        header += arr[i].toString(16);
      }
      // File MIME type patterns (.jpg, .jpeg, .png)
      switch (header) {
        case "89504e47":
          isValid = true;
          break;
        case "ffd8ffe0":
        case "ffd8ffe1":
        case "ffd8ffe2":
        case "ffd8ffe3":
        case "ffd8ffe8":
          isValid = true;
          break;
        default:
          isValid = false; // Or you can use the blob.type as fallback
          break;
      }

      if(isValid) {
        observer.next(null);
      }
      else {
        observer.next({ invalidMimeType: true });
      }
      observer.complete();
    });

    // Start the process of reading the file
    fileReader.readAsArrayBuffer(file);
  });

  // Return Observable
  return frObs;
};
