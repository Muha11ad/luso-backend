import { FilesService, ImageFolderName } from '../files';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoryService } from './service/category.service';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryCreateNameDto, CategoryUpdateNameDto } from './dto';
import { Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';

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
    @Body() data: CategoryCreateNameDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { name } = data;
    return this.categoryService.createCategory({ name, file });
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
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('id') id: string,
    @Body() { name }: CategoryUpdateNameDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.categoryService.updateCategory(id, { name, file });
  }
}
