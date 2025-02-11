import { Category } from "@prisma/client";
import { Injectable } from "@nestjs/common";
import { BaseResponse } from "@/shared/utils/types";
import { CategoryBaseService } from "./category.base.service";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class CategoryFindService extends CategoryBaseService {

    async findAll(): Promise<BaseResponse<Category[]>> {

        try {
        
            const data =  await this.database.category.findMany();

            return { errId: null, data  };
            
        } catch (error) {

            return ServiceExceptions.handle(error, CategoryFindService.name, "findAll");
        
        }

  
    }

}