import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Put,
  Param,
  Delete,
  Get,
  UploadedFile,
} from '@nestjs/common';
import { IdDto, NameDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { AuthGuard } from '@/module/auth';
import { FilesType, FileType } from '@/types';
import { ProductService } from '../service/product.service';
import { ParamsImageDto, ProductCreateDto, ProductUpdateDto } from '../dto';
import { IProductController } from './product.controller.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductController implements IProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.findAll();
  }

  @Get('/:id')
  async getProductById(@Param() id: IdDto): Promise<Product> {
    return this.productService.findById(id);
  }

  @Get('/byCategory/:name')
  async getProductByCategoryName(@Param() param: NameDto): Promise<Product[]> {
    return this.productService.findByCategoryName(param.name);
  }

  @Get('/name/:name')
  async getProductByName(@Param() param: NameDto): Promise<Product> {
    return this.productService.findByName(param.name);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() data: ProductCreateDto): Promise<Product> {
    const product = await this.productService.create(data);
    return product;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param() id: IdDto, @Body() data: ProductUpdateDto): Promise<Product> {
    return await this.productService.update(id, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param() id: IdDto): Promise<Product> {
    return this.productService.delete(id);
  }

  @Delete('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  async deleteImage(@Param() params: ParamsImageDto): Promise<Product> {
    return this.productService.deleteImage(params);
  }

  @Post('/image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('image'))
  async saveImages(@Param() id: IdDto, @UploadedFiles() files: FilesType): Promise<Product> {
    return this.productService.saveImages(id, files);
  }

  @Put('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param() params: ParamsImageDto,
    @UploadedFile() file: FileType,
  ): Promise<Product> {
    return this.productService.updateImage(params, file);
  }
}
