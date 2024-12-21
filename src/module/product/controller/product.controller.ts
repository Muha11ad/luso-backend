import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductService } from '../service/product.service';
import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  BadRequestException,
  UseGuards,
  Put,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { ProductCreateDto, ProductUpdateDto } from '../dto';
import { AuthGuard } from '@/module/auth';
import { ExceptionErrorTypes, FilesType } from '@/types';
import { Product } from '@prisma/client';
import { IProductController } from './product.controller.interface';
import { IdDto } from '@/common/dto';

@Controller('product')
export class ProductController implements IProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('image', 3))
  async createProduct(@Body() data: any, @UploadedFiles() files: FilesType): Promise<Product> {
    if (!files || files.length === 0 || !files[0]) {
      throw new BadRequestException(ExceptionErrorTypes.IMAGE_REQUIRED);
    }
    const newData: ProductCreateDto = { ...data, available: true };
    const product = await this.productService.create(newData, files);
    return product;
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('image_1'),
    FilesInterceptor('image_2'),
    FilesInterceptor('image_3'),
  )
  async update(
    @Param('id') id: IdDto,
    @Body() data: ProductUpdateDto,
    @UploadedFiles() files?: FilesType,
  ): Promise<Product> {
    const product = await this.productService.update(id, data, files);
    return product;
  }
  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param() id: IdDto): Promise<string> {
    await this.productService.delete(id);
    return 'Product deleted successfully';
  }
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }
  @Get('/:id')
  async getProductById(@Param('id') id: IdDto): Promise<Product> {
    console.log('id', id);
    return this.productService.findById(id);
  }
  @Get('/byCategory/:categoryId')
  async getProductByCategoryId(@Param('categoryId') categoryId: IdDto): Promise<Product[]> {
    return this.productService.findByCategoryId(categoryId);
  }
  @Get('?name={name}')
  async getProductByName(@Param('name') name: string): Promise<Product[]> {
    return this.productService.findByName(name);
  }
}
