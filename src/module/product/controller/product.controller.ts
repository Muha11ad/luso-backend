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
  FilterProductsDto,
  DeleteCategoryFromProductDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { AuthGuard } from '@/module/auth';
import { FilesType, FileType } from '@/types';
import { PRODUCT_MESSAGES } from '../product.consts';
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

  @Post('/filter')
  @UseInterceptors(CacheInterceptor)
  async getProductsByFilter(@Body() data: FilterProductsDto): Promise<Product[]> {
    return this.findService.findByFilter(data);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() data: ProductCreateDto): Promise<string> {
    await this.crudService.create(data);
    return PRODUCT_MESSAGES.success_create;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param() param: IdDto, @Body() data: ProductUpdateDto): Promise<string> {
    await this.crudService.update(param.id, data);
    return PRODUCT_MESSAGES.success_update;
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param() param: IdDto): Promise<string> {
    await this.crudService.delete(param.id);
    return PRODUCT_MESSAGES.success_delete;
  }

  @Delete('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  async deleteImage(@Param() params: ParamsImageDto): Promise<string> {
    await this.imageService.deleteImage(params);
    return PRODUCT_MESSAGES.success_delete;
  }

  @Post('/image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('image'))
  async saveImages(@Param() id: IdDto, @UploadedFiles() files: FilesType): Promise<string> {
    await this.imageService.saveImages(id, files);
    return PRODUCT_MESSAGES.success_create;
  }

  @Put('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param() params: ParamsImageDto,
    @UploadedFile() file: FileType,
  ): Promise<string> {
    await this.imageService.updateImage(params, file);
    return PRODUCT_MESSAGES.success_update;
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async addCategoryToProduct(
    @Param() param: IdDto,
    @Body() data: AddCategoryToProductDto,
  ): Promise<string> {
    await this.productCategoryService.addCategoryToProduct(param.id, data);
    return PRODUCT_MESSAGES.success_category_add;
  }
  @Delete('category/:id')
  @UseGuards(AuthGuard)
  async deleteCategoryFromProduct(
    @Param() param: IdDto,
    @Body() data: DeleteCategoryFromProductDto,
  ): Promise<string> {
    await this.productCategoryService.deleteCategoryFromProduct(param.id, data.categoryId);
    return PRODUCT_MESSAGES.success_category_delete;
  }
}
