import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { ProvidersModule } from "@/shared/providers";
import { UserService } from "../../admin/user/user.service";

@Module({
    imports: [ProvidersModule],
    controllers: [UserController],
    providers: [UserService]
})
export class LandingUserModule {}
