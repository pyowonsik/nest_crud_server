import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    return await this.postRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 ID의 POST입니다.');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: createPostDto.userId,
      },
      relations: ['user'],
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 ID의 USER입니다.');
    }

    const post = await this.postRepository.save({
      ...createPostDto,
      user,
    });

    return post;
  }

  async update(id: number, updatePostDto: UpdatePostDto) {

    // update 정리
    // 1. post가 존재하는지 찾는다.
    // 2. updatePostDto를 userId , ...{title,content}(updatePost)를 분리
    // 3. userId가 있다면 user를 찾은후 , (1)에서 찾은 post의 user에 저장. -> post를 저장할때 user 객체가 필요함
    // 4. id(post)를 ...{title,content}(updatePost) , user : post.user로 저장.
    // 5. update된 새로운 post를 return;
    
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 ID의 POST입니다.');
    }

    // ...updatePostDto -> PostEntity에 userId 존재하지 않는다.
    const { userId, ...postRest } = updatePostDto;


    if (userId) {
      const user = await this.userRepository.findOne({
        where: {
          id: userId,
        },
      });

      if (!user) {
        throw new NotFoundException('존재하지 않는 ID의 USER입니다.');
      }

      post.user = user;
    }

    await this.postRepository.update(
      { id },
      {
        ...postRest,
        user : post.user,
      },
    );

    const newPost = await this.postRepository.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    return newPost;
  }

  async remove(id: number) {
    const post = await this.postRepository.findOne({
      where: {
        id,
      },
    });

    if (!post) {
      throw new NotFoundException('존재하지 않는 ID의 게시글입니다.');
    }

    await this.postRepository.delete(id);

    return id;
  }
}
