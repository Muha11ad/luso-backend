import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    try {
      const result = await this.cacheManager.get(key);
      if (result) return JSON.parse(result as string);
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async set<T>(key: string, value: T): Promise<any> {
    try {
      const jsonValue = JSON.stringify(value);
      return await this.cacheManager.set(key, jsonValue);
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async setex(key: string, value: any, ttl: number): Promise<any> {
    try {
      const jsonValue = JSON.stringify(value);
      return await this.cacheManager.set(key, jsonValue, ttl);
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async del(key: string): Promise<any> {
    try {
      return await this.cacheManager.del(key);
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
  async delAll(): Promise<any> {
    try {
      return await this.cacheManager.reset();
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
