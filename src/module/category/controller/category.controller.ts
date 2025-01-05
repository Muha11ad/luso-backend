import {
  CategoryCrudService,
  CategoryFindService,
  CategoryImageService,
  CategoryProductService,
} from '../service';
import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { AuthGuard } from '../../auth';
import { Category } from '@prisma/client';
import { FileValidatePipe } from '@/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { ICategoryController } from './category.controller.interface';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  AddProductToCategoryDto,
  CategoryCreateDto,
  CategoryUpdateDto,
  DeleteProductFromCategoryDto,
} from '../dto';
import { Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('category')
export class CategoryController implements ICategoryController {
  constructor(
    private readonly crudService: CategoryCrudService,
    private readonly findService: CategoryFindService,
    private readonly imageService: CategoryImageService,
    private readonly categoryProductService: CategoryProductService,
  ) {}
  @Get()
  async getCategories(): Promise<Category[]> {
    return this.findService.findAll();
  }
  @Get(':id')
  async getCategoryById(@Param() param: IdDto): Promise<Category> {
    return this.findService.findById(param.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(@Body() data: CategoryCreateDto): Promise<Category> {
    return this.crudService.create(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCategory(@Param() param: IdDto, @Body() data: CategoryUpdateDto): Promise<Category> {
    return this.crudService.update(param.id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param() param: IdDto): Promise<Category> {
    return this.crudService.delete(param.id);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async addProductToCategory(
    @Param() param: IdDto,
    @Body() data: AddProductToCategoryDto,
  ): Promise<Category> {
    return this.categoryProductService.addProductToCategory(param.id, data);
  }

  @Delete('product/:id')
  @UseGuards(AuthGuard)
  async DeleteProductFromCategory(
    @Param() param: IdDto,
    @Body() data: DeleteProductFromCategoryDto,
  ): Promise<Category> {
    return this.categoryProductService.deleteProductFromCategory(param.id, data.productId);
  }

  @Post('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async saveImage(
    @Param() param: IdDto,
    @UploadedFile(FileValidatePipe) image: FileType,
  ): Promise<Category> {
    return this.imageService.saveImage(param.id, image);
  }
  @Put('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param() param: IdDto,
    @UploadedFile(FileValidatePipe) image: FileType,
  ): Promise<Category> {
    return this.imageService.updateImage(param.id, image);
  }
}
