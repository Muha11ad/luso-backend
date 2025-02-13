import { Prisma } from "@prisma/client";
import { OrderCreateReq } from "../order.interface";

export class OrderCreateEntity {

    constructor(private readonly data: OrderCreateReq) { }

    private orderDetailsWithTotalPrice(){
        return this.data.orderDetails.map((detail) => {
            return {
                ...detail,
                total_price: detail.productPrice * detail.quantity
            }
        });

    }

    private get orderTotalPrice(): number {

        return this.orderDetailsWithTotalPrice().reduce(
            (acc, detail) => acc + detail.total_price,
            0
        );

    }

    private get orderDeliveryFee(): number {

        const deliveryFee = process.env.DELIVERY_FEE ? Number(process.env.DELIVERY_FEE) : 0;

        return this.orderTotalPrice > 400000 ? 0 : deliveryFee;

    }

    public toPrisma(): Prisma.OrderCreateInput {

        return {
            status: this.data?.status,
            region: this.data?.region,
            first_name: this.data?.firstName,
            total_price: this.orderTotalPrice,
            delivery_fee: this.orderDeliveryFee,
            phone_number: this.data?.phoneNumber,
            user: {
                connect: {
                    telegram_id: Number(this.data?.userId)
                }
            },
        };

    }

    public toOrderDetails(orderId: string): Prisma.OrderDetailsCreateManyInput[] {
        return this.orderDetailsWithTotalPrice().map((detail) => (
            {
                order_id: orderId,
                quantity: detail.quantity,
                product_id: detail.productId,
                total_price: detail.total_price,
                product_name: detail.productName,
                product_price: detail.productPrice,
            }
        ))
    }

}
