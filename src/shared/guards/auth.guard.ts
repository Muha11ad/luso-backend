import { MyError } from "../utils/error";
import { JwtService } from "@nestjs/jwt";
import { DatabaseProvider } from "../providers";
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private readonly jwtService: JwtService,
        private readonly database: DatabaseProvider
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<Request>();
        let token = request.headers["authorization"];
        if (!token) {
            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
        }

        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length).trimLeft();
        }

        try {
            const { email } = this.jwtService.verify(token);

            if (!email) {
                throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
            }

            const isAdmin = email === await this.database.admin.findUnique({ where: { email } });

            if (!isAdmin) {
                throw new UnauthorizedException(MyError.USER_NOT_ADMIN.message);
            }

            return true;

        } catch (error) {
            throw new UnauthorizedException(MyError.INVALID_TOKEN.message);
        }

    }

}
