import { Injectable } from "@nestjs/common";
import { OrderCreateEntity } from "../entity";
import { OrderBaseService } from "./order.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { OrderCreateReq, OrderDetailsCreateReq, OrderIdReq } from "../order.interface";

@Injectable()
export class OrderLifecycleService extends OrderBaseService {

    public async create(reqData: OrderCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.user.findUniqueOrThrow({ where: { telegram_id: reqData.userId } });

            await this.checkProductExists(reqData.orderDetails);

            const newOrder = new OrderCreateEntity(reqData);
            await this.database.$transaction(async (tx) => {

                const createdOrder = await tx.order.create({ data: newOrder.toPrisma() });

                await tx.orderDetails.createMany({
                    data: newOrder.toOrderDetails(createdOrder.id)
                });

                return createdOrder;

            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderLifecycleService.name, 'create');

        }

    }

    public async delete(reqData: OrderIdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.order.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.order.delete({
                where: {
                    id: reqData.id
                }
            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderLifecycleService.name, 'delete');

        }

    }

    private async checkProductExists(orderDetails: OrderDetailsCreateReq[]): Promise<void> {

        for (const detail of orderDetails) {

            await this.database.product.findUniqueOrThrow({
                where: {
                    id: detail.productId
                }
            });

        }

    }

}
