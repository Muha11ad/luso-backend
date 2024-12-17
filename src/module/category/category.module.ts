import { FilesModule } from '../files';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database';
import { CategoryService } from './service/category.service';
import { CategoryController } from './category.controller';

@Module({
  imports: [DatabaseModule, FilesModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
