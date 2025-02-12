import { JwtModuleAsyncOptions } from "@nestjs/jwt";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
    secret: process.env.JWT_SECRET || "defaultSecret",
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "3600s" 
}))

export const jwtOptions: JwtModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => ({
        secret: config.get('jwt.secret'),
        signOptions: {
            expiresIn: config.get('jwt.expiresIn')
        }
    })
};
