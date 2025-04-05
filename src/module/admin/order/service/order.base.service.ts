import { Injectable } from "@nestjs/common";
import { DatabaseProvider } from "@/shared/providers";

@Injectable()
export class OrderBaseService {

    constructor(
        public readonly database: DatabaseProvider,
    ) { }


}
