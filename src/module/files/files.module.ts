import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { pathToUpload } from '@/common/utils';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [ServeStaticModule.forRoot({ rootPath: pathToUpload })],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
