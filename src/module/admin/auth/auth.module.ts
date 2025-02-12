import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { ProvidersModule } from "@/shared/providers";

@Module({
    imports: [ProvidersModule],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AdminAuthModule {}
