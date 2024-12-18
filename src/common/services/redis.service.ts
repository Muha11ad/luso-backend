import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadGatewayException, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async get(key: string): Promise<any> {
    try {
      const value = await this.cacheManager.get(key);
      console.log('value', value);
      return value;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async set<T>(key: string, value: T): Promise<any> {
    try {
      const jsonValue = JSON.stringify(value);
      const result = await this.cacheManager.set(key, jsonValue);
      console.log('result', result);
      return result;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async setex(key: string, value: any, ttl: number): Promise<any> {
    try {
      const jsonValue = JSON.stringify(value);
      const result = await this.cacheManager.set(key, jsonValue, ttl);
      console.log('result', result);
      return result;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }

  async del(key: string): Promise<any> {
    try {
      const result = await this.cacheManager.del(key);
      return result;
    } catch (error) {
      throw new BadGatewayException(error.message);
    }
  }
}
