import { ComponentFixture, TestBed } from '@angular/core/testing';
import { from, Observable, of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router, RouterLinkWithHref } from '@angular/router';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { PostListComponent } from './post-list.component';
import { PostsService } from '../../services/posts.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


describe('PostListComponent', () => {
  let component: PostListComponent;
  let fixture: ComponentFixture<PostListComponent>;
  let service: PostsService;
  let getPostsSpy: jasmine.Spy;
  let mockPost: {
    title: string;
    content: string;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostListComponent ],
      providers: [PostsService],
      imports: [RouterTestingModule, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostListComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(PostsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // on ngOnInit()
  describe('ngOnInit()', () => {
    let spy: jasmine.Spy;

    let mockPost: {
      title: string;
      content: string;
      id: string;
      imagePath: string;
    };

    let mockPosts = [
      { title: 'New Post', content: 'New content', id: "1", imagePath: "imagePath1"},
      { title: 'Edit Post', content: 'Edit content', id: "2", imagePath: "imagePath2" }
    ];

    beforeEach(() => {
      mockPost = { title: 'New Post', content: 'New content', id: "1", imagePath: "imagePath1"};
    });

    it('should call service.getPostUpdateListener() to get posts content', () => {
      spy = spyOn(service, 'getPostUpdateListener').and.returnValue(from([{posts:[ ...mockPosts], postsCount: 1}]));

      component.ngOnInit();

      expect(spy).toHaveBeenCalled();
    });

    it('should set posts with the items returned from the service, when items > 0', () => {
      spy = spyOn(service, 'getPostUpdateListener').and.returnValue(from([{posts:[ ...mockPosts], postsCount: 1}]));

      component.ngOnInit();

      expect(component.posts).toEqual(mockPosts);
      expect(component.posts.length).toBeGreaterThan(0);
    });

    it('should set posts with [ ], when 0 items received from the service', () => {
      spyOn(service, 'getPosts').and.callThrough();

      component.ngOnInit();

      expect(component.posts).toEqual([]);
      expect(component.posts.length).toEqual(0);
    });
  });

  // onDelete()
  describe('onDelete()', () => {
    let deleteSpy: jasmine.Spy;
    let mockPost: {
      title: string;
      content: string;
      id: string;
      imagePath: string;
    };

    let mockPosts = [
      { title: 'New Post', content: 'New content', id: "1", imagePath: "imagePath1"},
      { title: 'Edit Post', content: 'Edit content', id: "2", imagePath: "imagePath2" }
    ];

    beforeEach(() => {
      component.posts = mockPosts;

      deleteSpy = spyOn(service, 'deletePost').and.callThrough();

      component.onDelete(mockPosts[0].id);
    });

    it('should call deletePost() service method on Delete button clicked', () => {
      expect(deleteSpy).toHaveBeenCalled();
    });

  });

});




