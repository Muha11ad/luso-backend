import { FileType } from '@/types';
import { IdDto } from '@/common/dto';
import { AuthGuard } from '../../auth';
import { Category } from '@prisma/client';
import { FileValidatePipe } from '@/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from '../service/category.service';
import { CategoryCreateDto, CategoryUpdateDto } from '../dto';
import { ICategoryController } from './category.controller.interface';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('category')
export class CategoryController implements ICategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getCategories(): Promise<Category[]> {
    return this.categoryService.findAllCategories();
  }
  @Get(':id')
  async getCategoryById(@Param('id') { id }: IdDto): Promise<Category> {
    return this.categoryService.findCategoryById(id);
  }
  @Get('/name/:name')
  async getCategoryByName(@Param('name') name: string): Promise<Category> {
    return this.categoryService.findCategoryByName(name);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(@Body() data: CategoryCreateDto): Promise<Category> {
    const { name } = data;
    return this.categoryService.createCategory({ name });
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCategory(
    @Param('id') { id }: IdDto,
    @Body() { name }: CategoryUpdateDto,
  ): Promise<Category> {
    return this.categoryService.updateCategory(id, { name });
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param('id') { id }: IdDto): Promise<Category> {
    return this.categoryService.deleteCategory(id);
  }
  @Post('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @Param('id') { id }: IdDto,
    @UploadedFile(FileValidatePipe) image: FileType,
  ): Promise<Category> {
    return this.categoryService.uploadImage(id, image);
  }
}
