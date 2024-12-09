import { Movie } from 'src/movie/entity/movie.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Director {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  dob: Date;

  @Column()
  nationality: string;

  @OneToMany(() => Movie, (movie) => movie.director)
  movie: Movie[];
}
