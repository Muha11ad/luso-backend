import { Injectable } from "@nestjs/common";
import { CategoryBaseService } from "./category.base.service";
import { BaseResponse, SuccessRes } from "@/shared/utils/types";
import { CategoryCreateEntity, CategoryUpdateEntity } from "../entity";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { CategoryCreateReq, CategoryDeleteReq, CategoryUpdateReq } from "../category.interface";

@Injectable()
export class CategoryCrudService extends CategoryBaseService {


  async delete(reqData: CategoryDeleteReq): Promise<BaseResponse<SuccessRes>> {
    try {

      await this.database.category.delete({ where: { id: reqData.id } });

      await this.redisProvider.delAll()

      return { errId: null, data: { success: true } };

    } catch (error) {
      return ServiceExceptions.handle(
        error,
        CategoryCrudService.name,
        "delete"
      );
    }
  }

  async create(reqData: CategoryCreateReq): Promise<BaseResponse<SuccessRes>> {
    try {
      const { errId, data } = await this.checkName(reqData.name);

      if (errId) {
        return { errId, data: null };
      }

      const categoryEntity = new CategoryCreateEntity(reqData);

      await this.database.category.create({
        data: categoryEntity.toPrisma(),
      });
      await this.redisProvider.delAll()

      return { errId: null, data: { success: true } };
    } catch (error) {
      return ServiceExceptions.handle(
        error,
        CategoryCrudService.name,
        "create"
      );
    }
  }

  async update(reqData: CategoryUpdateReq): Promise<BaseResponse<SuccessRes>> {

    try {

      const category = await this.database.category.findUniqueOrThrow({
        where: { id: reqData.id },
      });

      if (reqData["name"]) {

        const { errId, data } = await this.checkName(reqData.name);
        
        if (errId) {
        
          return { errId, data: null };
        
        }
      }

      const categoryEntity = new CategoryUpdateEntity(category, reqData);

      await this.database.category.update({
        where: { id: reqData.id },
        data: categoryEntity.toPrisma(),
      });

      await this.redisProvider.delAll()

      return { errId: null, data: { success: true } };

    } catch (error) {

      return ServiceExceptions.handle(error, CategoryCrudService.name, "update");

    }
  }
}
