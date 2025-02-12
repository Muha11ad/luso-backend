import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { ENDPOINTS } from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { Controller, Get, } from "@nestjs/common";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { UseInterceptors, HttpStatus, Res } from "@nestjs/common";
import { CategoryFindService } from "@/module/admin/category/service";

@Controller(ENDPOINTS.category)
@ApiTags(ENDPOINTS.category)
export class CategoryController {

    constructor(
        private readonly findService: CategoryFindService,
    ) { }

    @Get('all')
    @UseInterceptors(CacheInterceptor)
    async getAll(@Res() res: Response) {

        const { errId, data } = await this.findService.findAll();

        if (errId) {

            return res.status(HttpStatus.BAD_GATEWAY).send(setResult(null, errId));

        }

        return res.status(HttpStatus.OK).send(setResult(data, null));

    }

}
