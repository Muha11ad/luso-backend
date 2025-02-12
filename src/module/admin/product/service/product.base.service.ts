import { Injectable } from "@nestjs/common";
import { DatabaseProvider, RedisProvider } from "@/shared/providers";

@Injectable()
export class ProductBaseService {

    constructor(
        public database: DatabaseProvider,
        public redisProvider: RedisProvider,
    ) { }

}
