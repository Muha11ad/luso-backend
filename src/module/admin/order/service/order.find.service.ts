import { Order } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { ORDERE_TOTAL_QUERY } from "../order.queries";
import { OrderBaseService } from "./order.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { OrderGetByUserIdReq, OrderGetTotalRes, OrderIdReq } from "../order.interface";

@Injectable()
export class OrderFindService extends OrderBaseService {

    public async findAll(): Promise<BaseResponse<Order[]>> {

        try {

            const orders = await this.database.order.findMany({
                include: {
                    OrderDetails: true
                },
                orderBy: {
                    created_at: 'desc'
                },

            });

            const total = await this.database.order.count();

            return { errId: null, data: orders, total };


        } catch (error) {

            return ServiceExceptions.handle(error, OrderFindService.name, this.findAll.name);

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

            return ServiceExceptions.handle(error, OrderFindService.name, this.findById.name);

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

            return ServiceExceptions.handle(error, OrderFindService.name, this.findByUserId.name);

        }

    }

    public async findTotalOrders(): Promise<BaseResponse<OrderGetTotalRes>> {

        try {

            const result = await this.database.$queryRaw<Array<OrderGetTotalRes>>(ORDERE_TOTAL_QUERY);

            const total: OrderGetTotalRes = {
                ...result[0],
                payed: result[0].totalPayment - result[0].waitingPayments
            }

            return { errId: null, data: total };


        } catch (error) {

            return ServiceExceptions.handle(error, OrderFindService.name, this.findTotalOrders.name);

        }

    }

}
