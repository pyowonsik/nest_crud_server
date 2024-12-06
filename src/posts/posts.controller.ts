import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostsService } from './posts.service';

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}


@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // 1) GET /posts
  // 모든 posts를 다 가져온다.
  @Get() // http://localhost:3000/posts
  getPosts(): Post[] {
    return this.postsService.getAllPosts();
  }

  // 2) GET /posts/:id
  // id에 해당되는 post를 가져온다.
  // 예를 들어서 id=1인 경우 id가 1인 post를 가져온다.
  @Get(':id') // http://localhost:3000/posts/:id
  getPost(@Param('id') id: string): Post {
   return this.postsService.getPostById(id);
  }
  // 3) POST /posts
  // post를 생성한다.
  @Post() // http://localhost:3000/posts
  postPosts(
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Post[] {
    return this.postsService.createPost(author,title,content);
  }

  // 4) PATCH  /posts/:id
  // id에 해당하는 post를 변경한다.
  @Patch(':id') // http://localhost:3000/posts/:id
  patchPost(
    @Param('id') id: string,
    @Body('author') author: string,
    @Body('title') title: string,
    @Body('content') content: string,
  ): Post {
    return this.postsService.updatePost(id,author,title,content);
  }

  // 5) DELETE /posts/:id
  // id에 해당하는 post를 삭제한다.
  @Delete(':id') // http://localhost:3000/posts/:id
  deletePost(@Param('id') id: string): Post[] {
    return this.postsService.deletePost(id);
  }
}
