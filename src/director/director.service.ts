import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Director } from './entities/director.entity';
import { NotFoundError } from 'rxjs';
import { dir } from 'console';

@Injectable()
export class DirectorService {
  constructor(
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
  ) {}

  async findAll() {
    return await this.directorRepository.find();
  }

  async findOne(id: number) {
    const director = await this.directorRepository.findOne({
      where: {
        id,
      },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
    }

    return director;
  }

  async create(createDirectorDto: CreateDirectorDto) {
    const director = await this.directorRepository.save(createDirectorDto);

    return director;
  }

  async update(id: number, updateDirectorDto: UpdateDirectorDto) {
    const director = await this.directorRepository.findOne({
      where: { id },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
    }

    await this.directorRepository.update(
      {
        id,
      },
      updateDirectorDto,
    );

    const newDirector = await this.directorRepository.findOne({
      where: {
        id,
      },
    });

    return newDirector;
  }

  remove(id: number) {
    const director = this.directorRepository.findOne({
      where: {
        id,
      },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
    }

    this.directorRepository.delete(id);

    return id;
  }
}
