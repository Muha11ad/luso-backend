import { Cache } from 'cache-manager';
import { map, Observable, tap } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, ExecutionContext, CallHandler, Inject, NestInterceptor,} from '@nestjs/common';

@Injectable()
export class CustomCacheInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const { method, params, query } = request;


        // Get Cache Key from Decorators
        const cacheKey = this.reflector.get<string>('cacheGet', context.getHandler());
        const deleteKey = this.reflector.get<string>('cacheDelete', context.getHandler());

        // Handle GET Request Caching
        if (method === 'GET' && cacheKey) {
            const fullCacheKey = this.generateCacheKey(cacheKey, params, query);
            const cachedResponse = await this.cacheManager.get(fullCacheKey);

            if (cachedResponse) {
                return new Observable((observer) => {
                    observer.next(cachedResponse);
                    observer.complete();
                });
            }

            return next.handle().pipe(
                tap(async (response) => {
                    
                    await this.cacheManager.set(fullCacheKey, response);
                }),
            );
        }

        // Handle Cache Deletion for POST, PUT, DELETE Requests
        if (deleteKey) {
            return next.handle().pipe(
                tap(async () => {
                    await this.clearMatchingCache(deleteKey);
                }),
            );
        }
        map((response)=>{
            return response;
        })
    }

    // Generate dynamic cache key using request params and query
    private generateCacheKey(baseKey: string, params: any, query: any): string {
        let key = baseKey;

        if (params) {
            key += ':' + Object.values(params).join(':');
        }

        if (query) {
            key += '?' + new URLSearchParams(query).toString();
        }

        return key;
    }

    // Delete all cache keys that match a given prefix
    private async clearMatchingCache(deleteKey: string) {
        const keys: string[] = await this.cacheManager.store.keys(`${deleteKey}*`);
        for (const key of keys) {
            await this.cacheManager.del(key);
        }
    }
}
