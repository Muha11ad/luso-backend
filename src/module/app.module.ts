import { Module} from '@nestjs/common';
import { CategoryModule } from './category';
import { DatabaseModule } from './database';

@Module({
  imports: [CategoryModule, DatabaseModule],
})
export class AppModule {}
