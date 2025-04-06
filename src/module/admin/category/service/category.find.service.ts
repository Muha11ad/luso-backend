import { Category } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { CategoryBaseService } from "./category.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { CategoryGetAllReq } from "../category.interface";

@Injectable()
export class CategoryFindService extends CategoryBaseService {

    async findAll(): Promise<BaseResponse<Category[]>> {

        try {

            const categories = await this.database.category.findMany();

            const total = await this.database.category.count();

            return { errId: null, data: categories, total };

        } catch (error) {

            return ServiceExceptions.handle(error, CategoryFindService.name, this.findAll.name);

        }

    }

}