import { Injectable, NotFoundException } from '@nestjs/common';

interface Post {
  id: number;
  author: string;
  title: string;
  content: string;
  likeCount: number;
  commentCount: number;
}

@Injectable()
export class PostsService {
  private posts: Post[] = [
    {
      id: 1,
      author: 'newJeans_official',
      title: '뉴진스 민지',
      content: '메이크업 고치고 있는 민지',
      likeCount: 1000000,
      commentCount: 99999,
    },
    {
      id: 2,
      author: 'newJeans_official',
      title: '뉴진스 해린',
      content: '노래 연습하고 있는 해린',
      likeCount: 1000000,
      commentCount: 99999,
    },
    {
      id: 3,
      author: 'blackpink_official',
      title: '블랙핑크 로제',
      content: '종합운동장에서 운동하고 있는 로제',
      likeCount: 1000000,
      commentCount: 99999,
    },
  ];

  getAllPosts(): Post[] {
    return this.posts;
  }

  getPostById(id: string): Post {
    const post = this.posts.find((post) => post.id === +id);
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return post;
  }

  createPost(author: string, title: string, content: string): Post[] {
    const post: Post = {
      id: this.posts.length > 0 ? this.posts[this.posts.length - 1].id + 1 : 1, 
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    this.posts = [...this.posts, post];
    return this.posts;
  }

  updatePost(id: string, author: string, title: string, content: string): Post {
    const post = this.getPostById(id);

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    this.posts = this.posts.map((prevPost) => (prevPost.id === +id ? post : prevPost));
    return post;
  }

  deletePost(id: string): Post[] {
    const post = this.getPostById(id);
    this.posts = this.posts.filter((p) => p.id !== post.id);
    return this.posts;
  }
}
