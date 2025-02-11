import { AuthModule } from "../auth";
import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { ProvidersModule } from "@/shared/providers";

@Module({
    imports: [ProvidersModule, AuthModule],
    controllers: [UserController],
    providers: [UserService]
})
export class UserModule {}
