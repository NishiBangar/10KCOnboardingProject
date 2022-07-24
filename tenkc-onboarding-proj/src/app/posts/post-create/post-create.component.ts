import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { stringify } from 'querystring';

import { Post } from '../post.model';
import { PostsService } from '../../services/posts.service';
import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  // Making Agular aware that an event will be emitted
  // Turns this property into an EVENT, which can be listened to from the outside (PARENT COMPONENT)
  // @Output() postCreated = new EventEmitter<Post>();

  enteredData = {
    title: '',
    content: ''
  }
  private mode = 'create';
  private postId: string;

  form: FormGroup;
  imagePreview: string;
  post: Post;
  isLoading = false;

  constructor(public postsService: PostsService, public route: ActivatedRoute) { }

  ngOnInit(): void {

    // Initialize Form and FormGroup
    this.form = new FormGroup({
      'title': new FormControl( null, {
            validators: [ Validators.required, Validators.minLength(3)]
      }),
      'content': new FormControl( null, {
            validators: [ Validators.required]
      }),
      image: new FormControl( null, {
            validators: [Validators.required],
            asyncValidators: [mimeType]})
    });

    // if Create or Edit post route
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // Loading spinner
        this.isLoading = true;
        // this.post = this.postsService.getPost(this.postId);
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
              this.isLoading = false;
              this.post = {id: postData._id,
                           title: postData.title,
                           content: postData.content,
                           imagePath: postData.imagePath};

                           console.log("--- Edit -- post details");
                           console.log(this.post);
                           this.imagePreview = this.post.imagePath;
              // Populate Reactive form with values
              this.form.setValue({
                'title': this.post.title,
                'content': this.post.content,
                'image': this.post.imagePath
              });

            })
      }
      else{
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

// onImagePicked() --> on file selected to upload along Post
onImagePicked(event: Event) {
  const file = (event.target as HTMLInputElement).files[0];
  //store file object
  this.form.patchValue({
    image: file
  });

  // Inform Angular to re-evalueate validation after file update
  this.form.get('image').updateValueAndValidity();
  // console.log(file);
  // console.log(this.form);
  console.log(this.form);

  // The below proces is done, because file reading is an ASYN process,
      //  hence --> onLoad() --> Do things once file is loaded
  // Create a reader
  const reader = new FileReader();
  // Do something once the file loaded/read
  reader.onload = () => {
    this.imagePreview = reader.result as string;
    // console.log("--- Reader Onload --- Image Preview");
    // console.log(this.imagePreview);
  };
  //Load a file
  reader.readAsDataURL(file);
};

// Reactive form onSavePost()
  onSavePost(){
    if(this.form.invalid){
      return;
    }
    // Loading spinner
    this.isLoading = true;

    if(this.mode === 'create'){
      this.postsService.addPost(this.form.value.title,
                                this.form.value.content,
                                this.form.value.image);
    } else{
      this.postsService.updatePost(this.postId,
                                  this.form.value.title,
                                  this.form.value.content,
                                  this.form.value.image);
    }
    this.form.reset();
  }


  // onAddPost(){
     // alert("Post Added");
    // this.newPost = this.enteredValue;
    // const post: Post = {
    //   title: this.enteredData.title,
    //   content: this.enteredData.content
  // }
  //   //Emit event with data to be listened from other component (through Parent component)
  //   this.postCreated.emit(post);
  // }


    /* onSavePost(form: NgForm){
      console.log("----- Form content");
      console.log(form);
      if(form.invalid){
        return;
      }
      // Loading spinner
      this.isLoading = true;

      if(this.mode === 'create'){
        this.postsService.addPost(form.value.title, form.value.content);
      } else{
        this.postsService.updatePost(this.postId, form.value.title, form.value.content);
      }
      form.resetForm();
      // const post: Post = {
      //   title: form.value.title,
      //   content: form.value.content
      // }
      //Emit event with data to be listened from other component (through Parent component)
    // this.postCreated.emit(post);
    } */




}
