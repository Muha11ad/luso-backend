import { Order } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { DatabaseProvider } from "@/shared/providers";

@Injectable()
export class OrderBaseService {

    constructor(public database: DatabaseProvider) { }

    public async checkOrder(id: string): Promise<BaseResponse<Order>> {

        const order = await this.database.order.findUniqueOrThrow({
            where: {
                id
            }
        });

        return { errId: null, data: order };

    }

}
