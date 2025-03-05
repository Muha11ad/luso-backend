import { Category } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { REDIS_ENDPOINT_KEYS } from "@/shared/utils/consts";
import { CategoryBaseService } from "./category.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class CategoryFindService extends CategoryBaseService {

    async findAll(): Promise<BaseResponse<Category[]>> {

        try {

            const cachedProducts: Category[] | null = await this.redisProvider.get(REDIS_ENDPOINT_KEYS.categoryAll);

            if (cachedProducts) {

                return { errId: null, data: cachedProducts };

            }

            const categories = await this.database.category.findMany();

            await this.redisProvider.set(REDIS_ENDPOINT_KEYS.categoryAll, categories)

            return { errId: null, data: categories };

        } catch (error) {

            return ServiceExceptions.handle(error, CategoryFindService.name, "findAll");

        }


    }

}