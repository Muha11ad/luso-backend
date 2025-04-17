import { Order, OrderStatus } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { OrderBaseService } from "./order.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { OrderGetAllReq, OrderGetByUserIdReq, OrderGetTotalRes, OrderIdReq } from "../order.interface";

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

    public async getTotalOrders(): Promise<BaseResponse<OrderGetTotalRes>> {

        try {

            const result = await this.database.$queryRaw<Array<OrderGetTotalRes>>`
                SELECT 
                    COUNT(o.id)::int AS "ordersCount",
                    SUM(od.quantity)::int AS "soldProducts",
                    SUM(CASE WHEN o.status != 'Payed' THEN o.total_price ELSE 0 END)::int AS "waitingPayments",
                    SUM(CASE WHEN o.status != 'Canceled' THEN o.total_price ELSE 0 END)::int AS "totalPayment",
                    SUM(CASE WHEN o.user_id != '968954832' THEN od.product_price * 0.2 ELSE 0 END)::int AS "mimsShare"
                FROM "Order" o
                LEFT JOIN "OrderDetails" od ON o.id = od.order_id
            `;

            return { errId: null, data: result[0] };


        } catch (error) {

            return ServiceExceptions.handle(error, OrderFindService.name, this.getTotalOrders.name);

        }

    }

}
