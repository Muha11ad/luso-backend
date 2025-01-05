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
import {
  ProductCategoryService,
  ProductCrudService,
  ProductFindService,
  ProductImageService,
} from '../service';
import { IdDto, NameDto } from '@/common/dto';
import { Product } from '@prisma/client';
import { AuthGuard } from '@/module/auth';
import { FilesType, FileType } from '@/types';
import { IProductController } from './product.controller.interface';
import {
  ParamsImageDto,
  ProductCreateDto,
  ProductUpdateDto,
  DeleteCategoryFromProductDto,
} from '../dto';
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

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.findService.findAll();
  }

  @Get('/:id')
  async getProductById(@Param() id: IdDto): Promise<Product> {
    return this.findService.findById(id);
  }

  @Get('/byCategory/:name')
  async getProductByCategoryName(@Param() param: NameDto): Promise<Product[]> {
    return await this.findService.findByCategoryName(param.name);
  }

  @Get('/name/:name')
  async getProductByName(@Param() param: NameDto): Promise<Product[]> {
    return this.findService.findByName(param.name);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createProduct(@Body() data: ProductCreateDto): Promise<Product> {
    const product = await this.crudService.create(data);
    return product;
  }

  @Put('/:id')
  @UseGuards(AuthGuard)
  async updateProduct(@Param() id: IdDto, @Body() data: ProductUpdateDto): Promise<Product> {
    return await this.crudService.update(id, data);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteProduct(@Param() id: IdDto): Promise<Product> {
    return this.crudService.delete(id);
  }

  @Delete('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  async deleteImage(@Param() params: ParamsImageDto): Promise<Product> {
    return this.imageService.deleteImage(params);
  }

  @Post('/image/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FilesInterceptor('image'))
  async saveImages(@Param() id: IdDto, @UploadedFiles() files: FilesType): Promise<Product> {
    return this.imageService.saveImages(id, files);
  }

  @Put('/:id/image/:image_id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param() params: ParamsImageDto,
    @UploadedFile() file: FileType,
  ): Promise<Product> {
    return this.imageService.updateImage(params, file);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async addCategoryToProduct(
    @Param() param: IdDto,
    @Body() data: AddCategoryToProductDto,
  ): Promise<Product> {
    return this.productCategoryService.addCategoryToProduct(param.id, data);
  }
  @Delete('category/:id')
  @UseGuards(AuthGuard)
  async deleteCategoryToProduct(
    @Param() param: IdDto,
    @Body() data: DeleteCategoryFromProductDto,
  ): Promise<Product> {
    return this.productCategoryService.deleteCategoryFromProduct(param.id, data.categorytId);
  }
}
