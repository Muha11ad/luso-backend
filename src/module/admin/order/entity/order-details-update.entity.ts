import { OrderDetails, Prisma } from "@prisma/client";
import { OrderDetailsUpdateReq } from "../order.interface";

export class OrderDetailsUpdateEntity {
    constructor(
        private readonly oldData: OrderDetails,
        private readonly newData: OrderDetailsUpdateReq,
    ) { }

    public toPrisma(): Prisma.OrderDetailsUpdateInput {
        const { quantity: newQuantity, productPrice: newProductPrice } = this.newData;
        const { quantity: oldQuantity, product_price: oldProductPrice } = this.oldData;

        const quantity = newQuantity ?? oldQuantity;
        const productPrice = newProductPrice ?? oldProductPrice;
        const totalPrice = quantity * productPrice;

        return {
            quantity: newQuantity !== undefined ? newQuantity : undefined,
            product_price: newProductPrice !== undefined ? newProductPrice : undefined,
            total_price: totalPrice,
        };
    }
}
