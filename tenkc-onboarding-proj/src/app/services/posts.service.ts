import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';


import { Post } from '../posts/post.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private http: HttpClient, private router: Router) { }

  private posts: Post[] = [];
  private postsUpdated = new Subject<{posts: Post[]; postsCount: number}>();
  private backend_url: string = "http://localhost:4000/api/posts";

  // Get all posts
  getPosts(postsPerPage: number, currentPage: number) {
    // return [...this.posts];
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
    .get<{message: string, posts: any, maxPosts: number}> (this.backend_url + queryParams)
      .pipe(map((postData) => {
        return { posts: postData.posts.map((post: { title: any; content: any; _id: any; imagePath: any; }) => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath
            }
          }), maxPosts: postData.maxPosts
        };
      }))
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;

        this.postsUpdated.next( { posts: [...this.posts],
                                  postsCount: transformedPostsData.maxPosts});
      });
  };

  //Get post based on the postId;
  getPost(id: string) {
  // return {...this.posts.find(p => p.id === id)}
    return this.http.get<{_id: string, title: string, content: string, imagePath: string}>
        (this.backend_url + "/" +id);
  }

  // Add post with image using FormData object
  addPost(title: string, content: string, image: File) {
    const postData = new FormData(); // combine text and blog data
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);  //arg1 -> propertyName; arg2 -> imageFile; arg3 -> fileName sent to backend
    //Send POST data to the server
    this.http
      .post<{message: string, post: Post}>(
          this.backend_url, postData)
            .subscribe((responseData) => {
              // console.log("---- Response from Server ----");
              // console.log(responseData);
              // console.log("--- image path ----");
              // console.log(responseData.post.imagePath);
              // console.log(responseData.post.title);
              // const post: Post = {
              //   id: responseData.post.id,
              //   title: title,
              //   content: content,
              //   imagePath: responseData.post.imagePath
              // };
              // this.posts.push(post);
              // // pushes/emits the new value after updated --> emitting whenever adding a post
              // this.postsUpdated.next([...this.posts]);

              // Navigate back to the root page (lists page)
              this.router.navigate(['/']);
            });
  };
/* // Add post without image using JSON object
  addPost(title: string, content: string) {
    const post: Post = {id: null, title: title, content: content};
    //Send POST data to the server
    this.http
      .post<{message: string, postId: string}>('http://localhost:4000/api/posts', post)
        .subscribe((responseData) => {
          console.log(responseData.message);
          const id = responseData.postId;
          post.id = id;
          this.posts.push(post);
           // pushes/emits the new value after updated --> emitting whenever adding a post
          this.postsUpdated.next([...this.posts]);

          // Navigate back to the root page (lists page)
          this.router.navigate(['/']);
        });
  }; */

  //Update Post ---- if String Image - send Json req; ---- if File obj -> send as FormData
  updatePost(id: string, title: string, content: string, image: File | string){
    let postData: Post | FormData;
    if(typeof(image) === 'object'){ // New Image -> send FormData
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("content", content);
      postData.append('image', image, title);  //arg1 -> propertyName; arg2 -> imageFile; arg3 -> fileName sent to backend
    }
    else { // Existing Image -> send Json req
        postData = {
          id: id,
          title: title,
          content: content,
          imagePath: image };
    }


    this.http.put(this.backend_url + "/" +id, postData)
      .subscribe((response)=> {
        // console.log(response);
        // const updatedPosts = [...this.posts];
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id);
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: ""
        // }
        // updatedPosts[oldPostIndex] = post;
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);

        // Navigate back to the root page (lists page)
        this.router.navigate(['/']);

        // const updatedPosts = this.posts.filter(post => post.id != postId);
        // this.posts = updatedPosts;
        // this.postsUpdated.next([...this.posts]);
      })
  };

  // Delete a post --> method 1 -> without pagination details from the server
  /* deletePost(postId: string) {
    this.http.delete("http://localhost:4000/api/posts/"+postId)
      .subscribe(()=> {
        console.log("Deleted post");
        const updatedPosts = this.posts.filter(post => post.id != postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      })
  };*/

  // Delete a post --> method 2 --> with pagination details
  deletePost(postId: string) {
    // retun posts as observatble
    return this.http.delete(this.backend_url + "/" + postId);
  }

  // Listen to the object, ones the data is updated
  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

}
