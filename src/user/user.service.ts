import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const user = this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 ID의 회원입니다.');
    }

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    // cascade를 false로 가져간다면, profile object를 찾아서(저장) profile 객체를 넣어준다.
    // const profile = await this.profileRepository.save({
    //   profileImage : createUserDto.profileImage
    // })


    const user = await this.userRepository.save({
      ...createUserDto,
      // profile,
      profile: {
        profileImage: createUserDto.profileImage,
      },
    });

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 ID의 회원입니다.');
    }

    // user를 update 할때는 profile에 대한 정보가 필요없다.
    // ...userRest = ...{email : email , password : password};
    // profileImage를 분리해서 profile을 update하기 위해 profileImage를 분리함 .!!
    // const { profileImage , ...userRest} = updateUserDto;
    const profileImage = updateUserDto.profileImage;
    const userRest = {
      email : updateUserDto.email,
      password : updateUserDto.password
    };
    
    await this.userRepository.update({ id : user.id }, {...userRest});

    if (profileImage) {
      if (!user.profile) {
        throw new NotFoundException('유저의 프로필 정보가 없습니다.');
      }

      await this.profileRepository.update(
        { id: user.profile.id },
        { profileImage },
      );
    }

    const updatedUser = this.userRepository.findOne({
      where: { id },
      relations: ['profile'],
    });

    return updatedUser;
  }

  async remove(id: number) {
    const user = this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('존재하지 않는 ID의 회원입니다.');
    }

    await this.userRepository.delete(id);

    return id;
  }
}
