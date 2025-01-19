import { redisStore } from 'cache-manager-redis-store';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';

export const redisOptions: CacheModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    const password = configService.get<string>('REDIS_PASSWORD')
    console.log(password)
    try {
      const store = await redisStore({
        socket: {
          host: configService.get<string>('REDIS_HOST'),
          port: parseInt(configService.get<string>('REDIS_PORT'), 10),
          reconnectStrategy: (retries) => Math.min(retries * 50, 2000),
          connectTimeout: 10000,
          
        },
        password
      });

      return {
        store,
        ttl: 600, // 10 minutes in seconds
      };
    } catch (error) {
      console.error('Error connecting to Redis:', error);
      throw error;
    }
  },
  inject: [ConfigService],
};