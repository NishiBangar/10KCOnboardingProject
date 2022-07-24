import { TitleCaseDirective } from './title-case.directive';


let elRefMock = {
  nativeElement: document.createElement('div')
};

describe('TitleCaseDirective', () => {
  it('should create an instance', () => {
    const directive = new TitleCaseDirective(elRefMock);
    expect(directive).toBeTruthy();
  });
});
