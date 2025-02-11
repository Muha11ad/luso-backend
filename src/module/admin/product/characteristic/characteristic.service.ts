import { Injectable } from "@nestjs/common";
import { MyError } from "@/shared/utils/error";
import { DatabaseProvider, RedisProvider } from "@/shared/providers";
import { BaseResponse, IdReq, SuccessRes } from "@/shared/utils/types";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { CharacteristicCreateEntity, CharacteristicUpdateEntity } from "./entity";
import { CharacteristicCreateReq, CharacteristicUpdateReq } from "./characteristic.interface";

@Injectable()
export class CharacteristicService {

    constructor(
        private readonly database: DatabaseProvider,
        private readonly redisProvider: RedisProvider
    ) { }

    public async create(reqData: CharacteristicCreateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.product.findUniqueOrThrow({ where: { id: reqData.productId } });

            const characteristicEntity = new CharacteristicCreateEntity(reqData);

            await this.database.characteristic.create({ data: characteristicEntity.toPrisma() })

            await this.redisProvider.delAll()

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, CharacteristicService.name, "create");

        }


    }

    public async update(reqData: CharacteristicUpdateReq): Promise<BaseResponse<SuccessRes>> {

        try {

            const existingCharacteristic = await this.database.characteristic.findUnique({ where: { id: reqData.id } });

            if (!existingCharacteristic) {

                return { errId: MyError.NOT_FOUND.errId, data: null };

            }

            if (reqData.productId) {

                const existingProduct = await this.database.product.findUnique({ where: { id: reqData.productId } });

                if (!existingProduct) {

                    return { errId: MyError.NOT_FOUND.errId, data: null };

                }

            }


            const characteristicEntity = new CharacteristicUpdateEntity(existingCharacteristic, reqData);

            await this.database.characteristic.update({ where: { id: reqData.id }, data: characteristicEntity.toPrisma() });

            await this.redisProvider.delAll()

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, CharacteristicService.name, "update");

        }

    }

    public async delete(reqData: IdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.characteristic.findUniqueOrThrow({ where: { id: reqData.id } });

            await this.database.characteristic.delete({ where: { id: reqData.id } });

            await this.redisProvider.delAll()

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, CharacteristicService.name, "delete");

        }

    }

}
