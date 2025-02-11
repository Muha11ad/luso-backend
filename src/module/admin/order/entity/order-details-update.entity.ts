import { Prisma } from "@prisma/client";
import { OrderDetailsUpdateReq } from "../order.interface";

export class OrderDetailsUpdateEntity {
    constructor(
        private readonly data: OrderDetailsUpdateReq,
        private readonly originalTotalPrice: number
    ) { }

    
    public toPrisma(): Prisma.OrderDetailsUpdateInput {
        const { quantity, productPrice } = this.data;

        if (quantity && productPrice) {
            return {
                quantity,
                product_price: productPrice,
                total_price: quantity * productPrice,
            };
        }

        if (quantity) {
            return {
                quantity,
                product_price: this.calculateProductPrice(quantity),
                total_price: quantity * this.calculateProductPrice(quantity),
            };
        }

        if (productPrice) {
            return {
                quantity: this.calculateQuantity(productPrice),
                product_price: productPrice,
                total_price: this.calculateQuantity(productPrice) * productPrice,
            };
        }

        return {};
    }


    private calculateProductPrice(quantity: number): number {
        return this.originalTotalPrice / quantity;
    }

    private calculateQuantity(productPrice: number): number {
        return this.originalTotalPrice / productPrice; 
    }

}