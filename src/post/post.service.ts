import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

// SELECT : SELECT * FROM post WHERE id = :id
// INSERT : INSERT INTO post VALUES(createPostDto)
// UPDATE : UPDATE post SET (updatePostDto) where id = :id
// DELETE : DELETE FROM post WHERE id = :id

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll() {
    // const post = await this.postRepository.find({
    //   relations: ['user'],
    // });
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .getMany();

    if (!post) {
      throw new NotFoundException('POST가 존재하지 않습니다.');
    }

    return post;
  }

  async findOne(id: number) {
    // const post = await this.postRepository.findOne({
    //   where: {
    //     id,
    //   },
    //   relations: ['user'],
    // });
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException('존재하지 않는 ID의 POST입니다.');
    }

    return post;
  }

  async create(createPostDto: CreatePostDto) {
    // const user = await this.userRepository.findOne({
    //   where: {
    //     id: createPostDto.userId,
    //   },
    // });
    const user = await this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id: createPostDto.userId })
      .getOne();

    if (!user) {
      throw new NotFoundException('존재하지 않는 ID의 USER입니다.');
    }

    // const post = await this.postRepository.save({
    //   ...createPostDto,
    //   user,
    // });
    const post = await this.postRepository
      .createQueryBuilder()
      .insert()
      .into('post')
      .values({ ...createPostDto, user })
      .returning('*')
      .execute();

    return post.raw[0];
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    // update 정리
    // 1. post가 존재하는지 찾는다.
    // 2. updatePostDto를 userId , ...{title,content}(updatePost)를 분리
    // 3. userId가 있다면 user를 찾은후 , (1)에서 찾은 post의 user에 저장. -> post를 저장할때 user 객체가 필요함
    // 4. id(post)를 ...{title,content}(updatePost) , user : post.user로 저장.
    // 5. update된 새로운 post를 return;

    // const post = await this.postRepository.findOne({
    //   where: {
    //     id,
    //   },
    // });
    const post = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException('존재하지 않는 ID의 POST입니다.');
    }

    // ...updatePostDto -> PostEntity에 userId 존재하지 않는다.
    const { userId, ...postRest } = updatePostDto;

    if (userId) {
      // const user = await this.userRepository.findOne({
      //   where: {
      //     id: userId,
      //   },
      // });
      const user = await this.userRepository
        .createQueryBuilder('users')
        .where('users.id = :id', { id: userId })
        .getOne();

      if (!user) {
        throw new NotFoundException('존재하지 않는 ID의 USER입니다.');
      }

      post.user = user;
    }

    // await this.postRepository.update(
    //   { id },
    //   {
    //     ...postRest,
    //     user: post.user,
    //   },
    // );
    await this.postRepository
      .createQueryBuilder()
      .update('post')
      .set({ ...postRest, user: post.user })
      .where('id = :id', { id })
      .execute();

    // const newPost = await this.postRepository.findOne({
    //   where: {
    //     id,
    //   },
    //   relations: ['user'],
    // });
    const newPost = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.id = :id', { id })
      .getOne();

    return newPost;
  }

  async remove(id: number) {
    // const post = await this.postRepository.findOne({
    //   where: {
    //     id,
    //   },
    // });
    const post = await this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.user', 'user')
      .where('post.id = :id', { id })
      .getOne();

    if (!post) {
      throw new NotFoundException('존재하지 않는 ID의 게시글입니다.');
    }

    // await this.postRepository.delete(id);
    await this.postRepository
      .createQueryBuilder()
      .delete()
      .from('post')
      .where('id = :id', { id })
      .execute();

    return id;
  }
}
