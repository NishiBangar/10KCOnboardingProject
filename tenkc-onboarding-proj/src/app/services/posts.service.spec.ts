import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { PostsService } from './posts.service';

// Stub class for Router
class RouterStub {
  navigate(params: any) {
    return params;
  }
}

//Stub class for ActivatedRoute
class ActivatedRouteStub {
  params: Observable<any> = of(true);
}

describe('PostsService', () => {
  let service: PostsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PostsService,
        { provide: Router, useClass: RouterStub },
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
      ],
      declarations: [],
    });
    service = TestBed.inject(PostsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Service methods", () => {

    it('should have getPosts function', () => {
      expect(service.getPosts).toBeTruthy();
     });

    it('should have getPost by ID function', () => {
      expect(service.getPost).toBeTruthy();
     });

    it('should have addPost function', () => {
      expect(service.addPost).toBeTruthy();
     });
    it('should have updatePost function', () => {
      expect(service.updatePost).toBeTruthy();
     });
    it('should have deletePost function', () => {
      expect(service.deletePost).toBeTruthy();
     });
  });
  /* describe('Router navigate()', () => {
    let mockPost: {
      title: string;
      content: string;
      id: number;
    };
    beforeEach(() => {
      mockPost = {
        title: 'New Post',
        content: 'New Content',
        id: 1,
      };
    });
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should redirect to the List page after createPost()', () => {
      let router = TestBed.inject(Router);

      let spy = spyOn(router, 'navigate');

      service.createPost(mockPost);

      expect(spy).toHaveBeenCalledWith(['/posts']);
    });
    it('should redirect to the Edit page after editPost()', () => {
      let router = TestBed.inject(Router);
      let spy = spyOn(router, 'navigate');
      service._posts = [mockPost];
      service.editPost({
        title: 'updated title',
        content: 'updated content',
        id: 1,
      });

      expect(spy).toHaveBeenCalledWith(['/posts']);
    });
  }); */
});



