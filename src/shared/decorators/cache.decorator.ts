import { SetMetadata } from '@nestjs/common';

export const CacheGet = (key: string) => SetMetadata('cacheGet', key);

export const CacheDelete = (key: string) => SetMetadata('cacheDelete', key);