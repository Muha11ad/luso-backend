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
  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() data: ProductCreateDto): Promise<Product> {
    const product = await this.productService.create(data);
    return product;
  }
  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param('id') id: IdDto, @Body() data: ProductUpdateDto): Promise<Product> {
    return await this.productService.update(id, data);
  }
  @Delete('/:id')
  @UseGuards(AuthGuard)
  async delete(@Param() id: IdDto): Promise<Product> {
    return this.productService.delete(id);
  }
  @Post('/upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async sageImages(@Param('id') id: IdDto, @UploadedFiles() files: FilesType): Promise<Product> {
    return this.productService.saveImages(id, files);
  }

  @Put('/upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  async updateImages(@Param('id') id: IdDto, @UploadedFiles() files: FilesType): Promise<Product> {
    return this.productService.saveImages(id, files);
  }
}
