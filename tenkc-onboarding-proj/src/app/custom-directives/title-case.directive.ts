import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTitleCase]'
})
export class TitleCaseDirective {
 // @Input('format') format; // with 1 directive property --> appTitleCase [format] = "'lowercase'"
 @Input('appTitleCase') format; // with no directive property --> [appTitleCase]="'uppercase'">


 constructor(private el: ElementRef) { }

 @HostListener('focus') onFocus() {
   console.log("--Custom Directive: Fucus ---");
 }
 @HostListener('blur') onBlur() {
   console.log("--Custom Directive: Blur ---");

   let value: string = this.el.nativeElement.value;
   if(this.format == 'lowercase')
     this.el.nativeElement.value = value.toLowerCase();
   else{

        let words = value.split(' ');
        for(var i = 0; i < words.length; i++) {
          let word = words[i].toLowerCase();
          if(i > 0 && this.isPreposition(word)) {
            words[i] = word.toLowerCase();
          }
          else{
            words[i] = this.toTitleCase(word);
          }
      }
      this.el.nativeElement.value = words.join(' ');

   }
 }


  private isPreposition(word: string): boolean {
    let preposition = [
      'of', 'the'
    ];

    return preposition.includes(word);
  }

  private toTitleCase(word: string): string {
    return word.substr(0, 1).toUpperCase() + word.substr(1).toLowerCase();
  }


}

