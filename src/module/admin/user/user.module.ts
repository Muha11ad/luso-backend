import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ProvidersModule } from "@/shared/providers";

@Module({
    imports: [ProvidersModule],
    controllers: [UserController],
    providers: [UserService]
})
export class AdminUserModule {}
