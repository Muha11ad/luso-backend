import { AuthGuard } from '../../auth';
import { FileValidatePipe } from '@/common/pipes';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from '../service/category.service';
import { CategoryCreateNameDto, CategoryUpdateNameDto } from '../dto';
import { ICategoryController } from './category.controller.interface';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';

@Controller('category')
export class CategoryController implements ICategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getCategories() {
    return this.categoryService.findAllCategories();
  }
  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Body() data: CategoryCreateNameDto,
    @UploadedFile(FileValidatePipe) file: Express.Multer.File,
  ) {
    const { name } = data;
    return this.categoryService.createCategory({ name, file });
  }
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }
  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoryService.findCategoryById(id);
  }

  @Post('name')
  async getCategoryByName(@Body('name') name: string) {
    return this.categoryService.findCategoryByName(name);
  }
  @Put(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id') id: string,
    @Body() { name }: CategoryUpdateNameDto,
    @UploadedFile(FileValidatePipe) file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategory(id, { name, file });
  }
}
