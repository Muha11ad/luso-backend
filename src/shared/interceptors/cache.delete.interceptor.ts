import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cache } from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CallHandler, ExecutionContext, Injectable, NestInterceptor, Inject } from '@nestjs/common';

@Injectable()
export class CacheDeleteInterceptor implements NestInterceptor {

    constructor(
        private readonly reflector: Reflector,
        @Inject(CACHE_MANAGER) private readonly cacheManager: Cache
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

        const cacheKey = this.reflector.get<string[]>('cacheDelete', context.getHandler());

        return next.handle().pipe(
        
            tap(async () => {
        
                if (cacheKey) {
        
                    const keys = Array.isArray(cacheKey) ? cacheKey : [cacheKey];
                    
                    for (const key of keys) {

                        await this.cacheManager.del(key);
                    
                    }
        
                }
        
            })
        
        );
    }
}
