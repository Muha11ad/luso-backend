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
  async getCategoryById(@Param() param: IdDto): Promise<Category> {
    return this.categoryService.findCategoryById(param.id);
  }

  @Post()
  @UseGuards(AuthGuard)
  async createCategory(@Body() data: CategoryCreateDto): Promise<Category> {
    return this.categoryService.createCategory(data);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateCategory(@Param() param: IdDto, @Body() data: CategoryUpdateDto): Promise<Category> {
    return this.categoryService.updateCategory(param.id, data);
  }
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCategory(@Param() param: IdDto): Promise<Category> {
    return this.categoryService.deleteCategory(param.id);
  }
  @Post('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async saveImage(
    @Param() param: IdDto,
    @UploadedFile(FileValidatePipe) image: FileType,
  ): Promise<Category> {
    return this.categoryService.saveImage(param.id, image);
  }
  @Put('upload/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateImage(
    @Param() param: IdDto,
    @UploadedFile(FileValidatePipe) image: FileType,
  ): Promise<Category> {
    return this.categoryService.updateImage(param.id, image);
  }
}
