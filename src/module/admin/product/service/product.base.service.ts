import { Injectable } from "@nestjs/common";
import { DatabaseProvider } from "@/shared/providers";

@Injectable()
export class ProductBaseService {

    constructor(
        public database: DatabaseProvider,
    ) { }

}
