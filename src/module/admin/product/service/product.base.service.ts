import { Injectable } from "@nestjs/common";
import { DatabaseProvider, FilesProvider, RedisProvider } from "@/shared/providers";

@Injectable()
export class ProductBaseService {

    constructor(
        public database: DatabaseProvider,
        public redisProvider: RedisProvider,
        public filesProvider: FilesProvider
    ) { }

}
