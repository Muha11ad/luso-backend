import {
  Put,
  Get,
  Body,
  Post,
  Param,
  Delete,
  UseGuards,
  Controller,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import {
  ProductCrudService,
  ProductFindService,
  ProductImageService,
  ProductCategoryService,
} from '../service';
import {
  ParamsImageDto,
  ProductCreateDto,
  ProductUpdateDto,
  DeleteCategoryFromProductDto,
} from '../dto';
import { Product } from '@prisma/client';
import { AuthGuard } from '@/module/auth';
import { SUCCESS_MESSAGES } from '../types';
import { IdDto, NameDto } from '@/common/dto';
import { FilesType, FileType } from '@/types';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { IProductController } from './product.controller.interface';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AddCategoryToProductDto } from '../dto/add-category-to-product.dto';

@Controller('product')
export class ProductController implements IProductController {
  constructor(
    private readonly findService: ProductFindService,
    private readonly crudService: ProductCrudService,
    private readonly imageService: ProductImageService,
    private readonly productCategoryService: ProductCategoryService,
  ) {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.findService.findAll();
  }

  @Get('/:id')
  @UseInterceptors(CacheInterceptor)
  async getProductById(@Param() id: IdDto): Promise<Product> {
    return this.findService.findById(id);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/name/:name')
  async getProductByName(@Param() param: NameDto): Promise<Product[]> {
    return this.findService.findByName(param.name);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() data: ProductCreateDto): Promise<string> {
    await this.crudService.create(data);
    return SUCCESS_MESSAGES.PRODUCT_CREATED;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param() param: IdDto, @Body() data: ProductUpdateDto): Promise<string> {
    await this.crudService.update(param.id, data);
    return SUCCESS_MESSAGES.PRODUCT_UPDATED;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param() param: IdDto): Promise<string> {
    await this.crudService.delete(param.id);
    return SUCCESS_MESSAGES.PRODUCT_DELETED;
  }

  @Delete('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  async deleteImage(@Param() params: ParamsImageDto): Promise<string> {
    await this.imageService.deleteImage(params);
    return SUCCESS_MESSAGES.IMAGE_DELETED;
  }

  @Post('/image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('image'))
  async saveImages(@Param() id: IdDto, @UploadedFiles() files: FilesType): Promise<string> {
    await this.imageService.saveImages(id, files);
    return SUCCESS_MESSAGES.IMAGES_SAVED;
  }

  @Put('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param() params: ParamsImageDto,
    @UploadedFile() file: FileType,
  ): Promise<string> {
    await this.imageService.updateImage(params, file);
    return SUCCESS_MESSAGES.IMAGE_UPDATED;
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async addCategoryToProduct(
    @Param() param: IdDto,
    @Body() data: AddCategoryToProductDto,
  ): Promise<string> {
    await this.productCategoryService.addCategoryToProduct(param.id, data);
    return SUCCESS_MESSAGES.CATEGORY_ADDED;
  }
  @Delete('category/:id')
  @UseGuards(AuthGuard)
  async deleteCategoryFromProduct(
    @Param() param: IdDto,
    @Body() data: DeleteCategoryFromProductDto,
  ): Promise<string> {
    await this.productCategoryService.deleteCategoryFromProduct(param.id, data.categoryId);
    return SUCCESS_MESSAGES.CATEGORY_DELETED;
  }
}
