import { Injectable } from "@nestjs/common";
import { OrderDetailsUpdateEntity } from "../entity";
import { OrderBaseService } from "./order.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { OrderDetailsUpdateReq, OrderUpdateReq, OrderUpdateStatusReq } from "../order.interface";

@Injectable()
export class OrderUpdateService extends OrderBaseService {

    public async update(reqData: OrderUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.order.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.order.update({
                where: { id: reqData.id },
                data: {
                    region: reqData?.region,
                    first_name: reqData?.firstName,
                    phone_number: reqData?.phoneNumber,
                }
            })

            return { errId: null, data: { success: true } };


        } catch (error) {

            return ServiceExceptions.handle(error, OrderUpdateService.name, this.update.name);

        }

    }

    public async updateStatus(reqData: OrderUpdateStatusReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.order.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.order.update({
                where: { id: reqData.id },
                data: { status: reqData.status }
            });


            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderUpdateService.name, this.updateStatus.name);

        }

    }

    public async updateDetails(reqData: OrderDetailsUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const existingOrderDetails = await this.database.orderDetails.findUniqueOrThrow({
                where: { id: reqData.id }
            });

            const orderDetailsEntity = new OrderDetailsUpdateEntity(existingOrderDetails, reqData);

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

            return ServiceExceptions.handle(error, OrderUpdateService.name, this.updateDetails.name);

        }

    }

}
