import { User } from "@prisma/client";
import { UserCreateReq } from "./user.interface";
import { DatabaseProvider } from "@/shared/providers";
import { BadGatewayException, Injectable } from "@nestjs/common";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { BaseResponse, SuccessRes, UserIdReq } from "@/shared/utils/types";

@Injectable()
export class UserService {

    constructor(private readonly database: DatabaseProvider) { }

    public async getAll(): Promise<BaseResponse<User[]>> {

        try {

            const users = await this.database.user.findMany({orderBy: {created_at: 'asc'}});
            return { errId: null, data: users };

        } catch (error) {

            return ServiceExceptions.handle(error, UserService.name, this.getAll.name);

        }



    }

    public async delete(reqData: UserIdReq): Promise<BaseResponse<SuccessRes>> {

        try {

            await this.database.user.delete({

                where: {
                    telegram_id: reqData.id
                }
            
            });

            return { errId: null, data: { success: true } };

        } catch (error) {

            return ServiceExceptions.handle(error, UserService.name, this.delete.name);

        }

    }

    public async checkExistOrCreate(reqData: UserCreateReq): Promise<BaseResponse<User>> {

        const user = await this.database.user.findUnique({ where: { telegram_id: reqData.telegramId }, include: { orders: true } });

        if (user) {

            return { errId: null, data: user };

        }

        return this.create(reqData);

    }

    public async getById(reqData: UserIdReq): Promise<BaseResponse<User>> {

        try {

            const user = await this.database.user.findUniqueOrThrow({ 
                where: { telegram_id: reqData.id } ,
                include: { orders: true }
            });

            return { errId: null, data: user };

        } catch (error) {

            return ServiceExceptions.handle(error, UserService.name, this.getById.name);

        }

    }

    private async create(reqData: UserCreateReq): Promise<BaseResponse<User>> {

        try {

            const user = await this.database.user.create({
                data: {
                    name: reqData.name,
                    username: reqData.username,
                    telegram_id: reqData.telegramId
                }
            });

            return { errId: null, data: user };

        } catch (error) {

            throw new BadGatewayException(error.message);

        }

    }

}
