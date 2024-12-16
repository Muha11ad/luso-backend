import { Param, Delete, Put } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './';
import { Body, Controller, Get, Post } from '@nestjs/common';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @Get()
  async getCategories() {
    return this.categoryService.findAllCategories();
  }
  @Post()
  async createCategory(@Body() data: CreateCategoryDto) {
    return this.categoryService.createCategory(data);
  }
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
  async updateCategory(@Param('id') id: string, @Body() data: UpdateCategoryDto) {
    return this.categoryService.updateCategory(id, data);
  }
}
