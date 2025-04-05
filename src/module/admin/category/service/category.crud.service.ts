import { Injectable } from "@nestjs/common";
import { CategoryBaseService } from "./category.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { CategoryCreateEntity, CategoryUpdateEntity } from "../entity";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { CategoryCreateReq, CategoryDeleteReq, CategoryUpdateReq } from "../category.interface";

@Injectable()
export class CategoryCrudService extends CategoryBaseService {

  public async create(reqData: CategoryCreateReq): Promise<BaseResponse<SuccessRes>> {

    try {

      const categoryEntity = new CategoryCreateEntity(reqData);

      await this.database.category.create({

        data: categoryEntity.toPrisma(),

      });

      return { errId: null, data: { success: true } };

    } catch (error) {

      return ServiceExceptions.handle(error, CategoryCrudService.name, this.create.name);

    }
  }

  public async update(reqData: CategoryUpdateReq): Promise<BaseResponse<SuccessRes>> {

    try {

      const category = await this.database.category.findUniqueOrThrow({
        where: { id: reqData.id },
      });

      const categoryEntity = new CategoryUpdateEntity(category, reqData);

      await this.database.category.update({
        where: { id: reqData.id },
        data: categoryEntity.toPrisma(),
      });

      return { errId: null, data: { success: true } };

    } catch (error) {

      return ServiceExceptions.handle(error, CategoryCrudService.name, this.update.name);

    }
  }

  public async delete(reqData: CategoryDeleteReq): Promise<BaseResponse<SuccessRes>> {

    try {

      await this.database.category.delete({ where: { id: reqData.id } });

      return { errId: null, data: { success: true } };

    } catch (error) {

      return ServiceExceptions.handle(error, CategoryCrudService.name, this.delete.name);

    }
  }

}
