import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { MyError } from "../utils/error";
import { IS_PUBLIC_KEY } from "../decorators";
import { ConfigService } from "@nestjs/config";
import { DatabaseProvider } from "../providers";
import { JWT_CONFIG_KEYS } from "@/configs/jwt.config";
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
        
        let token = request.headers["authorization"];

        if (!token) throw new UnauthorizedException(MyError.INVALID_TOKEN.message);

        if (token.startsWith('Bearer ')) token = token.slice(7, token.length).trimLeft();

        try {

            const accessSecret = this.config.get(JWT_CONFIG_KEYS.accessSecret);

            const result = await this.jwtService.verify(token, { secret: accessSecret });


            if (!result.email) throw new UnauthorizedException(MyError.INVALID_TOKEN.message);

            const admin = await this.database.admin.findUnique({ where: { email: result.email } });

            if (!admin) throw new UnauthorizedException(MyError.USER_NOT_ADMIN.message);

            return true;

        } catch (error) {

            throw new UnauthorizedException(error.message);

        }

    }

}