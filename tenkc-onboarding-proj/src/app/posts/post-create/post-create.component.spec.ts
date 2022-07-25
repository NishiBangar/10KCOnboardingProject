import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostCreateComponent } from './post-create.component';
import { PostsService } from '../../services/posts.service';
import { Observable, of, Subject } from 'rxjs';
import { Post } from '../post.model';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// Stub class for Router
class RouterStub {
  navigate(params: any) {
    return params;
  }
}

//Stub class for ActivatedRoute
class ActivatedRouteStub {
  private subject = new Subject();

  push(value){
    this.subject.next(value);
  }
  get params(){
    return this.subject.asObservable();
  }
}


describe('PostCreateComponent', () => {
  let component: PostCreateComponent;
  let fixture: ComponentFixture<PostCreateComponent>;
  let service: PostsService;
  let addPostSpy: jasmine.Spy;
  let mockPost: {
    title: string;
    content: string;
    image: string;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PostCreateComponent],
      providers: [PostsService],
      imports: [RouterTestingModule, HttpClientTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCreateComponent);
    service = TestBed.inject(PostsService);
    addPostSpy = spyOn(service, 'addPost').and.returnValue();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add Post form elements
  describe('Add Post Form', () => {
    it('should have input field to enter post title', () => {
      const title = fixture.nativeElement.querySelector('#title');
      expect(title).toBeTruthy();
    });
    it('should have filePicker field to select image', () => {
      const filePicker = fixture.nativeElement.querySelector('#filePicker');
      expect(filePicker).toBeTruthy();
    });

    it('should have text-area to enter post content', () => {
      const content = fixture.nativeElement.querySelector('#content');
      expect(content).toBeTruthy();
    });

    it('should have submit button to create/save new post', () => {
      const submitButton = fixture.nativeElement.querySelector('#submitButton');
      expect(submitButton).toBeTruthy();
    });
  });

  // Create Post() method
  describe('onSavePost()', () => {
    let form: NgForm;
    let createSpy: jasmine.Spy;
    beforeEach(() => {
      component.mode = 'create';
      mockPost = {
        title: 'test title',
        content: 'some fantastic content',
        image: 'imagePath_1.jpg'
      };

      component.form.setValue({
        'title': mockPost.title,
        'content': mockPost.content,
        'image': mockPost.image
      });

      // fixture.nativeElement.querySelector('#title').value = mockPost.title;
      // fixture.nativeElement.querySelector('#title').dispatchEvent(new Event('input'));
      // fixture.nativeElement.querySelector('#image').value = mockPost.image;
      // fixture.nativeElement.querySelector('#content').value = mockPost.content;
      // fixture.nativeElement.querySelector('#content').dispatchEvent(new Event('input'));

      fixture.nativeElement.querySelector('#submitButton').click();
    });

    it('should call createPost() service method when form is submitted', () => {
      expect(component.form.valid).toBeTruthy();
    });

    it('should fail when form is invalid', () => {
      component.form.controls['image'].setValue('');
      expect(component.form.invalid).toBeTruthy();
    })
  });
   /* it('should update mode -> create/update based on routeParam value', () => {
      let router = TestBed.inject(Router);
      let route = TestBed.get(ActivatedRoute);

      route.push({"postId": "1"});
      // route.params.
      console.log("----- activated route mode");
      console.log(component.mode);
    }); */

});






