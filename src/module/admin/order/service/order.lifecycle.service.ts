import { Injectable } from "@nestjs/common";
import { OrderCreateEntity } from "../entity";
import { Product, User } from "@prisma/client";
import { MyError } from "@/shared/utils/error";
import { OrderBaseService } from "./order.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { OrderCreateReq, OrderIdReq } from "../order.interface";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class OrderLifecycleService extends OrderBaseService {

    private async checkUserExist(id: number | string): Promise<BaseResponse<User>> {

        const userExist = await this.database.user.findUnique({
            where: {
                telegram_id: Number(id)
            }
        });
        if (!userExist) {

            return { errId: MyError.NOT_FOUND.errId, data: null };

        }
        return { errId: null, data: userExist };

    }

    private async checkProductExists(orderDetails): Promise<BaseResponse<Product[]>> {

        for (const detail of orderDetails) {

            const productExist = await this.database.product.findUnique({
                where: {
                    id: detail.product_id
                }
            });
            if (!productExist) {

                return { errId: MyError.NOT_FOUND.errId, data: null };

            }

        }

    }

    public async create(reqData: OrderCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const { errId: userErrId, data: userExist } = await this.checkUserExist(reqData.userId);

            if (userErrId) {

                return { errId: userErrId, data: null };

            }

            const { errId: productErrId } = await this.checkProductExists(reqData.orderDetails);

            if (productErrId) {

                return { errId: productErrId, data: null }

            }

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

            const { errId, data: order } = await this.checkOrder(reqData.id);

            if (errId) {

                return { errId, data: null };

            }

            await this.database.order.delete({
                where: {
                    id: order.id 
                }
            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderLifecycleService.name, 'delete');

        }

    }

}
