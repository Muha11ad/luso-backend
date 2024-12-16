import { Param, Delete, Put, UseInterceptors, UploadedFile, Req } from '@nestjs/common';
import { CategoryService } from './service/category.service';
import { CreateCategoryDto, UpdateCategoryDto } from './';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesService } from '../files/files.service';
import { log } from 'console';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly fileService: FilesService,
    private readonly categoryService: CategoryService,
  ) {}
  @Get()
  async getCategories() {
    return this.categoryService.findAllCategories();
  }
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Body() data: Pick<CreateCategoryDto, 'name'>,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUrl = await this.fileService.saveFile(file);
    const categoryData = { name: data.name, imageUrl: fileUrl };
    return this.categoryService.createCategory(categoryData);
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
