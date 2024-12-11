import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Not, Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll() {
    // return await this.productRepository.find();
    return await this.productRepository.createQueryBuilder('product').getMany();
  }

  async findOne(id: number) {
    // const product = await this.productRepository.findOne({where : {
    //   id
    // }});

    // SQL : SELECT * FROM product WHERE id = :id
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException('존재하지않는 ID의 PRODUCT입니다.');
    }

    return product;
  }

  async findExpensive() {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.price', 'DESC')
      .getOne();

    if (!product) {
      throw new NotFoundException('PRODUCT가 비어있습니다.');
    }

    return product;
  }

  async findMany() {
    const product = await this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.stock', 'DESC')
      .getOne();

    if (!product) {
      throw new NotFoundException('PRODUCT가 비어있습니다.');
    }

    return product;
  }

  async create(createProductDto: CreateProductDto) {
    // const product = await this.productRepository.save(createProductDto);

    // SQL : INSERT INTO product VALUES(createProductDto)
    const product = await this.productRepository
      .createQueryBuilder()
      .insert()
      .into('product')
      .values(createProductDto)
      .returning('*')
      .execute();

    return product.raw[0];
  }

  // 트랜잭션을 사용한 create
  async createWithTransaction(createProductDto: CreateProductDto) {

    // QueryRunner 생성
    const queryRunner =
      this.productRepository.manager.connection.createQueryRunner();

    // 트랜잭션 시작
    await queryRunner.startTransaction();

    try {
      const product = this.productRepository
        .createQueryBuilder()
        .insert()
        .into('product')
        .values(createProductDto)
        .returning('*')
        .execute();

      // 트랜잭션 커밋
      await queryRunner.commitTransaction();

      return (await product).raw[0];
    } catch (error) {
      // 트랜잭션 롤백
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      // QueryRunner 해제
      await queryRunner.release();
    }
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    // const product = await this.productRepository.findOne({ where: { id } });

    // SQL : SELECT * FROM product WHERE id = :id
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException('존재하지않는 ID의 PRODUCT입니다.');
    }

    // await this.productRepository.update({ id }, updateProductDto);

    // SQL : UPDATE product SET (createProductDto) WHERE id = :id
    await this.productRepository
      .createQueryBuilder()
      .update('product')
      .set(updateProductDto)
      .where('id = :id', { id })
      .execute();

    // const newProduct = await this.productRepository.findOne({ where: { id } });

    // SQL : SELECT * FROM product WHERE id = :id
    const newProduct = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    return newProduct;
  }

  async remove(id: number) {
    // const product = await this.productRepository.findOne({ where: { id } });

    // SQL : SELECT * FROM product WHERE id = :id
    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOne();

    if (!product) {
      throw new NotFoundException('존재하지않는 ID의 PRODUCT입니다.');
    }

    // await this.productRepository.delete(id);

    // SQL : DELETE FROM product WHERE id = :id
    await this.productRepository
      .createQueryBuilder()
      .delete()
      .from('product')
      .where('id = :id', { id })
      .execute();

    return id;
  }
}
