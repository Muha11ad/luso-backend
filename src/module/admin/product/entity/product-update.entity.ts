import { Prisma, Product } from "@prisma/client";
import { TranslationType } from "@/shared/utils/types";
import { ProductUpdateReq } from "../product.interface";
import { updateTranslation } from "@/shared/utils/helpers";

export class ProductUpdateEntity {
    private updatingData: ProductUpdateReq;

    constructor(oldData: Product, newData: ProductUpdateReq) {
        this.updatingData = { ...newData };
        this.updateInstruction(oldData, newData);
    }

    private updateInstruction(oldData: Product, newData: ProductUpdateReq): void {

        if (newData.instruction) {
    
            this.updatingData.instruction = updateTranslation(oldData.instruction as TranslationType, newData.instruction);
    
        }
    
    }

    toPrisma(): Prisma.ProductUpdateInput {
        return {
            ...this.updatingData
        };
    }
}
