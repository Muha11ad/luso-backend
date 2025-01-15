import {
  CategoryCreateDto,
  CategoryUpdateDto,
  AddProductToCategoryDto,
  DeleteProductFromCategoryDto,
} from '../dto';
import { IdDto } from '@/common/dto';
import { AuthGuard } from '../../auth';
import { SUCCESS_MESSAGES } from '../types';
import { Category, Product } from '@prisma/client';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { ICategoryController } from './category.controller.interface';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CategoryCrudService, CategoryFindService, CategoryProductService } from '../service';

@Controller('category')
export class CategoryController implements ICategoryController {
  constructor(
    private readonly crudService: CategoryCrudService,
    private readonly findService: CategoryFindService,
    private readonly categoryProductService: CategoryProductService,
  ) {}
  @Get()
  @UseInterceptors(CacheInterceptor)
  async getCategories(): Promise<Category[]> {
    return this.findService.findAll();
  }
  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  async getCategoryById(@Param() param: IdDto): Promise<Category> {
    return this.findService.findById(param.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(@Body() data: CategoryCreateDto): Promise<string> {
    await this.crudService.create(data);
    return SUCCESS_MESSAGES.CATEGORY_CREATED;
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCategory(@Param() param: IdDto, @Body() data: CategoryUpdateDto): Promise<string> {
    await this.crudService.update(param.id, data);
    return SUCCESS_MESSAGES.CATEGORY_UPDATED;
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param() param: IdDto): Promise<string> {
    await this.crudService.delete(param.id);
    return SUCCESS_MESSAGES.CATEGORY_DELETED;
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  async addProductToCategory(
    @Param() param: IdDto,
    @Body() data: AddProductToCategoryDto,
  ): Promise<string> {
    await this.categoryProductService.addProductToCategory(param.id, data);
    return SUCCESS_MESSAGES.CATEGORY_PRODUCT_ADDED;
  }

  @Delete('product/:id')
  @UseGuards(AuthGuard)
  async deleteProductFromCategory(
    @Param() param: IdDto,
    @Body() data: DeleteProductFromCategoryDto,
  ): Promise<string> {
    await this.categoryProductService.deleteProductFromCategory(param.id, data.productId);
    return SUCCESS_MESSAGES.CATEGORY_PRODUCT_DELETED;
  }
  @Get('product/:id')
  @UseInterceptors(CacheInterceptor)
  async getCategoryProducts(
    @Param() param: IdDto,
  ): Promise<{ category: Category; products: Product[] }> {
    return await this.categoryProductService.findProductByCategoryId(param.id);
  }
}
