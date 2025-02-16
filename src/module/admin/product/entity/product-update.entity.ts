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
        const prismaUpdateInput: Prisma.ProductUpdateInput = {};

        if (this.updatingData.name !== undefined) {
            prismaUpdateInput.name = this.updatingData.name;
        }
        if (this.updatingData.price !== undefined) {
            prismaUpdateInput.price = this.updatingData.price;
        }
        if (this.updatingData.discount !== undefined) {
            prismaUpdateInput.discount = this.updatingData.discount;
        }
        if (this.updatingData.available !== undefined) {
            prismaUpdateInput.available = this.updatingData.available;
        }
        if (this.updatingData.instruction !== undefined) {
            prismaUpdateInput.instruction = this.updatingData.instruction;
        }
        if (this.updatingData.images && this.updatingData.images.length > 0) {
            prismaUpdateInput.Images = {
                create: this.updatingData.images.map(image => ({ imageUrl: image }))
            };
        }

        return prismaUpdateInput;
    }
}
