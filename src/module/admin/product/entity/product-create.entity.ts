import { Prisma } from "@prisma/client";
import { ProductCreateReq } from "../product.interface";
import { createTranslation } from "@/shared/utils/helpers";

export class ProductCreateEntity {

    constructor(private readonly data: ProductCreateReq) { }

    toPrisma(): Prisma.ProductCreateInput {

        return {
            name: this.data.name,
            price: this.data.price,
            discount: this.data.discount,
            available: this.data.available,
            instruction: createTranslation(this.data.instruction),
        };

    }

}
