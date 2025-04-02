import { Request } from "express";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { MyError } from "../utils/error";
import { TOKEN_KEYS } from "../utils/consts";
import { IS_PUBLIC_KEY } from "../decorators";
import { ConfigService } from "@nestjs/config";
import { DatabaseProvider } from "../providers";
import { JWT_CONFIG_KEYS } from "@/configs/jwt.config";
import { JWTDecoded } from "@/module/admin/auth/auth.interface";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector,
        private readonly config: ConfigService,
        private readonly jwtService: JwtService,
        private readonly database: DatabaseProvider
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();

        // req from swagger and telegram
        let accessToken = request.headers["authorization"];
        let refreshToken: string | undefined

        if (!accessToken) {

            accessToken = request.cookies[TOKEN_KEYS.acccessToken];
            refreshToken = request.cookies[TOKEN_KEYS.refreshToken];

        }

        if (!accessToken) throw new UnauthorizedException(MyError.INVALID_TOKEN.message);

        // extract token from bearer token
        accessToken = accessToken.split(" ")[1];

        try {

            const accessSecret = this.config.get(JWT_CONFIG_KEYS.accessSecret);

            const decodedAccessToken: JWTDecoded = await this.jwtService.verify(accessToken, { secret: accessSecret });

            await this.checkAdminEmail(decodedAccessToken);

            await this.handleTokenExpr(decodedAccessToken, refreshToken);

            return true;

        } catch (error) {

            throw new UnauthorizedException(error.message);

        }

    }

    private async checkAdminEmail(accessToken: JWTDecoded) {

        const admin = await this.database.admin.findUnique({ where: { email: accessToken.email } });

        if (!admin) throw new UnauthorizedException(MyError.USER_NOT_ADMIN.message);

    }

    private async handleTokenExpr(accessToken: JWTDecoded, refreshToken: string) {

        if (accessToken.iat < Date.now()) {

            const refreshSecret = this.config.get(JWT_CONFIG_KEYS.refreshSecret);
            
            const decodedRefreshToken: JWTDecoded = await this.jwtService.verify(refreshToken, { secret: refreshSecret });



        }

    }
}