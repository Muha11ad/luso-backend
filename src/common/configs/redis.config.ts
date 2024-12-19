import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export const redisOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: parseInt(configService.get<string>('REDIS_PORT')!, 10),
      },
    });

    return {
      store,
    };
  },
  inject: [ConfigService],
};
