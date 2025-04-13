import { ApiTags } from "@nestjs/swagger";
import { Public } from "@/shared/decorators";
import { UserCreateDto } from "../../admin/user";
import { ENDPOINTS} from "@/shared/utils/consts";
import { setResult } from "@/shared/utils/helpers";
import { UserService } from "../../admin/user/user.service";
import { Body, Controller, Post, } from "@nestjs/common";
import { UserCreateReq } from "../../admin/user/user.interface";

@Public()
@Controller()
@ApiTags(ENDPOINTS.user)
export class UserController {

    constructor(private readonly userService: UserService) { }

    @Post()
    async getOrCreate(@Body() body: UserCreateDto) {

        const requestData: UserCreateReq = body

        const { errId, data } = await this.userService.checkExistOrCreate(requestData);

        return setResult({ users: data }, errId);

    }
}
