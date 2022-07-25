import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
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
        { provide: Router, useClass: RouterStub }
      ],
      declarations: [],
    });
    service = TestBed.inject(PostsService);
  });

  let mockPost: {
    title: string;
    content: string;
    image: string;
    id: string;
    imagePath: string;
  };

  let title: string;
  let content: string;
  let image: File | string;
  let id: string;

  beforeEach(() => {
    mockPost = {
      title: 'New Post',
      content: 'New Content',
      image: 'imagePath1',
      id: "1",
      imagePath: 'imagePath2'
    };
    title = mockPost.title;
    content = mockPost.content;
    image = mockPost.image;
    id = "1";
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

  describe('CRUD methods', () => {

    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should call addPost() with 3 args', () => {

      let addPostSpy = spyOn(service, 'addPost');

      service.addPost(title, content, image);
      expect(addPostSpy).toHaveBeenCalledWith(title, content, image);
    });
    it('should call updatePost() with 4 args', () => {

      let updatePostSpy = spyOn(service, 'updatePost');

      service.updatePost(id, title, content, image);
      expect(updatePostSpy).toHaveBeenCalledWith(id, title, content, image);
    });

    it('should call deletePost() with 1 args', () => {
      let deletePostSpy = spyOn(service, 'deletePost');

      service.deletePost(id);
      expect(deletePostSpy).toHaveBeenCalledWith(id);
    });
  });

  describe("Reouter navigation", () => {
    let router: Router;
    let routeSpy;

    beforeEach(()=> {
      router = TestBed.inject(Router);
      routeSpy = spyOn(router, 'navigate');
    });

    it('should redirect to the List after new post added', () => {
      spyOn(service, 'addPost').and.callFake((title, content, image) => {
        router.navigate(['/']);
      });
      service.addPost(title, content, image);

      expect(routeSpy).toHaveBeenCalledWith(['/']);
    });

    it('should redirect to the List page after post updated', () => {
      spyOn(service, 'updatePost').and.callFake((id, title, content, image) => {
        router.navigate(['/']);
      });

      service.updatePost(id, title, content, image);

      expect(routeSpy).toHaveBeenCalledWith(['/']);
    });
  })

});



