import { Body, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { Movie } from './entity/movie.entity';
import { CreateMovieDto } from './dto/create.movie.dto';
import { UpdateMovieDto } from './dto/update.movie.dto';
import { MovieDetail } from './entity/movie-detail.entity';
import { Director } from 'src/director/entities/director.entity';
import { Genre } from 'src/genre/entities/genre.entity';
import { In, Not } from 'typeorm';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    @InjectRepository(MovieDetail)
    private readonly movieDetailRepository: Repository<MovieDetail>,
    @InjectRepository(Director)
    private readonly directorRepository: Repository<Director>,
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  // relations : 조회
  // cascade : 생성 , 수정
  async findAll() {
    return await this.movieRepository.find({
      relations: ['detail', 'director', 'genres'],
    });
  }

  async findOne(id: number) {
    const movie = await this.movieRepository.findOne({
      where: {
        id,
      },
      relations: ['detail', 'director', 'genres'],
    });
    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    return movie;
  }

  async create(createMovieDto: CreateMovieDto) {
    const director = await this.directorRepository.findOne({
      where: {
        id: createMovieDto.directorId,
      },
    });

    if (!director) {
      throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
    }

    const genres = await this.genreRepository.find({
      where: {
        id: In(createMovieDto.genres),
      },
    });

    if (!genres) {
      throw new NotFoundException('존재하지 않는 ID의 장르입니다.');
    }

    // cascade : dto의 값을 바로 넣어줄수 있음 , false = db에서 find로 값을 조회후 넣어줘야함.
    // const detail = await this.movieDetailRepository.save({
    //   detail: createMovieDto.detail,
    // });

    // movie에 들어가야될 property들을 추출해서 movie에 넣어준다.
    const movie = await this.movieRepository.save({
      title: createMovieDto.title,
      genres,
      detail: {
        detail: createMovieDto.detail,
      },
      director,
    });

    return movie;
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    // 기존 영화 로드
    const movie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    const { detail, directorId, genres, ...movieRest } = updateMovieDto;

    // 감독 업데이트
    if (directorId) {
      const director = await this.directorRepository.findOne({
        where: { id: directorId },
      });
      if (!director) {
        throw new NotFoundException('존재하지 않는 ID의 감독입니다.');
      }
      movie.director = director;
    }

    // 장르 업데이트
    if (genres) {
      const genreEntities = await this.genreRepository.find({
        where: { id: In(genres) },
      });

      if (genreEntities.length !== genres.length) {
        throw new NotFoundException(
          '존재하지 않는 ID의 장르가 포함되어 있습니다.',
        );
      }

      movie.genres = genreEntities;
    }
    
    // 영화 기본 정보 업데이트
    Object.assign(movie, movieRest);

    // 저장
    await this.movieRepository.save(movie);

    // 상세 정보 업데이트 (별도 처리)
    if (detail) {
      if (!movie.detail) {
        throw new NotFoundException('영화의 세부 정보가 없습니다.');
      }

      await this.movieDetailRepository.update(
        { id: movie.detail.id },
        { detail },
      );
    }

    // 업데이트된 영화 반환
    const updatedMovie = await this.movieRepository.findOne({
      where: { id },
      relations: ['detail', 'director', 'genres'],
    });

    return updatedMovie;
  }
  

  async delete(id: number) {
    const movie = this.movieRepository.findOne({
      where: {
        id,
      },
    });

    if (!movie) {
      throw new NotFoundException('존재하지 않는 ID의 영화입니다.');
    }

    this.movieRepository.delete(id);

    return id;
  }
}
