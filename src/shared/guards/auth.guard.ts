import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { MyError } from "../utils/error";
import { TOKEN_KEYS } from "../utils/consts";
import { Request, Response } from "express";
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
        const response = context.switchToHttp().getResponse<Response>();

        const { accessToken, refreshToken } = this.extractTokens(request);

        if (!accessToken) {

            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);

        }

        try {

            const decodedAccessToken = await this.verifyAccessToken(accessToken);
            await this.checkAdminEmail(decodedAccessToken);
            await this.handleTokenExpiration(decodedAccessToken, refreshToken, response);

            return true;

        } catch (error) {

            throw new UnauthorizedException(error.message || MyError.INVALID_TOKEN.message);

        }
    }

    private extractTokens(request: Request): { accessToken: string | undefined; refreshToken: string | undefined } {
        let accessToken = request.headers["authorization"];
        let refreshToken: string | undefined;

        if (!accessToken) {
            accessToken = request.cookies[TOKEN_KEYS.acccessToken];
            refreshToken = request.cookies[TOKEN_KEYS.refreshToken];
        }

        if (accessToken) {
            accessToken = accessToken.startsWith("Bearer ") ? accessToken.split(" ")[1] : accessToken;
        }

        return { accessToken, refreshToken };
    }

    private async verifyAccessToken(accessToken: string): Promise<JWTDecoded> {
        const accessSecret = this.config.get<string>(JWT_CONFIG_KEYS.accessSecret);
        return this.jwtService.verifyAsync<JWTDecoded>(accessToken, { secret: accessSecret });
    }

    private async checkAdminEmail(decodedAccessToken: JWTDecoded): Promise<void> {
        const admin = await this.database.admin.findUnique({ where: { email: decodedAccessToken.email } });

        if (!admin) {
            throw new UnauthorizedException(MyError.USER_NOT_ADMIN.message);
        }
    }

    private async handleTokenExpiration(
        decodedAccessToken: JWTDecoded,
        refreshToken: string | undefined,
        res: Response
    ): Promise<void> {
        const currentTime = Date.now();

        if (decodedAccessToken.exp > currentTime) return;

        if (!refreshToken) {
            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
        }

        const decodedRefreshToken = await this.verifyRefreshToken(refreshToken);

        if (decodedRefreshToken.email !== decodedAccessToken.email) {
            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
        }

        if (decodedRefreshToken.exp < currentTime) {
            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
        }

        const newAccessToken = await this.generateNewAccessToken(decodedRefreshToken.email);
        res.cookie(TOKEN_KEYS.acccessToken, newAccessToken);
    }

    private async verifyRefreshToken(refreshToken: string): Promise<JWTDecoded> {
        const refreshSecret = this.config.get<string>(JWT_CONFIG_KEYS.refreshSecret);

        try {
            return await this.jwtService.verifyAsync<JWTDecoded>(refreshToken, { secret: refreshSecret });
        } catch {
            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
        }
    }

    private async generateNewAccessToken(email: string): Promise<string> {
        return this.jwtService.signAsync(
            { email },
            {
                secret: this.config.get<string>(JWT_CONFIG_KEYS.accessSecret),
                expiresIn: this.config.get<string>(JWT_CONFIG_KEYS.accessExpires),
            }
        );
    }
}