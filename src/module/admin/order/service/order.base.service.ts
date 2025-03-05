import { Injectable } from "@nestjs/common";
import { DatabaseProvider, RedisProvider } from "@/shared/providers";

@Injectable()
export class OrderBaseService {

    constructor(
        public readonly database: DatabaseProvider,
        public readonly redisProvider: RedisProvider
    ) { }


}
