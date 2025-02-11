import { Injectable } from "@nestjs/common";
import { OrderDetailsUpdateEntity } from "../entity";
import { OrderBaseService } from "./order.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { OrderDetailsUpdateReq, OrderUpdateReq, OrderUpdateStatusReq } from "../order.interface";

@Injectable()
export class OrderUpdateService extends OrderBaseService {

    async updateOrder(reqData: OrderUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {
            const { errId, data } = await this.checkOrder(reqData.id);

            if (errId) {

                return { errId, data: null };

            }

            await this.database.order.update({
                where: { id: reqData.id },
                data: reqData
            })

            return { errId: null, data: { success: true } };


        } catch (error) {

            return ServiceExceptions.handle(error, OrderUpdateService.name, "updateOrder");

        }

    }

    async updateOrderStatus(reqData: OrderUpdateStatusReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const { errId, data } = await this.checkOrder(reqData.id);

            if (errId) {

                return { errId, data: null };
            }

            await this.database.order.update({
                where: { id: reqData.id },
                data: { status: reqData.status }
            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderUpdateService.name, "updateOrderStatus");

        }

    }

    async updateOrderDetails(reqData: OrderDetailsUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const existingOrderDetails = await this.database.orderDetails.findUniqueOrThrow({
                where: { id: reqData.id }
            });

            const orderDetailsEntity = new OrderDetailsUpdateEntity(reqData, existingOrderDetails?.total_price);

            const updatedOrderDetails = await this.database.orderDetails.update({
                where: { id: reqData.id },
                data: orderDetailsEntity.toPrisma()
            });

            const priceDifference =
                updatedOrderDetails.total_price - existingOrderDetails.total_price;

            await this.database.order.update({
                where: {
                    id: updatedOrderDetails.order_id
                },
                data: {
                    total_price: {
                        increment: priceDifference
                    }
                }
            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderUpdateService.name, "updateOrderDetails");

        }

    }

}
