import { Component, OnInit, Input } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: Post[] = [];
  private postsSub: Subscription;
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1,2,5,10];
  currentPage = 1;

  constructor(public postsService: PostsService) { }

  ngOnInit(): void {
    //Loading
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); //(default: page 1) arg1 = pageSize; arg2 = currentPage

    // Setup up a listener to the subject
     this.postsSub = this.postsService.getPostUpdateListener()
                              .subscribe((postData: {posts: Post[], postsCount: number})=> {

                                //Loading
                                this.isLoading = false;
                                this.totalPosts = postData.postsCount;
                                this.posts = postData.posts;
                              });
  }

  onDelete(postId: string){
    this.isLoading = true;
    this.postsService.deletePost(postId)
      .subscribe( () => {

        this.postsService.getPosts(this.postsPerPage, this.currentPage) ;
      });
  }

  // Pagination manipulation
  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;
    this.postsService.getPosts(this.postsPerPage, this.currentPage); // arg1 = pageSize; arg2 = currentPage

  };

  // To avoid memory leak, destroy the subscription data,
  // when the componenet dies.
  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

}
