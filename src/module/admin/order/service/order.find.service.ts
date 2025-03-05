import { Order } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { OrderBaseService } from "./order.base.service";
import { REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { OrderGetByUserIdReq, OrderIdReq } from "../order.interface";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class OrderFindService extends OrderBaseService {

    public async findAll(): Promise<BaseResponse<Order[]>> {

        try {

            const cachedOrders: Order[] | null = await this.redisProvider.get(REDIS_ENDPOINT_KEYS.ordersAll);

            if (cachedOrders) {

                return { errId: null, data: cachedOrders }

            }


            const orders = await this.database.order.findMany({
                include: {
                    OrderDetails: true
                }
            });

            await this.redisProvider.set(REDIS_ENDPOINT_KEYS.ordersAll, orders);

            return { errId: null, data: orders };


        } catch (error) {

            return ServiceExceptions.handle(error, OrderFindService.name, 'findAll');

        }


    }

    public async findById(reqData: OrderIdReq): Promise<BaseResponse<Order>> {

        try {

            const order = await this.database.order.findUnique({
                where: {
                    id: reqData.id
                },
                include: {
                    OrderDetails: true
                }
            });
            return { errId: null, data: order };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderFindService.name, 'findById');

        }
    }

    public async findByUserId(reqData: OrderGetByUserIdReq): Promise<BaseResponse<Order[]>> {

        try {

            const orders = await this.database.order.findMany({
                where: {
                    user_id: reqData.userId
                },
                include: {
                    OrderDetails: true
                }
            });

            return { errId: null, data: orders };

        } catch (error) {

            return ServiceExceptions.handle(error, OrderFindService.name, 'findByUserId');

        }

    }

}
