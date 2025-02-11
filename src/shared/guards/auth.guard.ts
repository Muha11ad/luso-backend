import { JwtService } from "@nestjs/jwt";
import {
    Injectable,
    CanActivate,
    ExecutionContext,
    UnauthorizedException
} from "@nestjs/common";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly jwtService: JwtService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const request = context.switchToHttp().getRequest<Request>();
        const token = request.headers["authorization"];
        if (!token) {

            throw new UnauthorizedException("No token provided");
    
        }
        try {

            const { email } = this.jwtService.verify(token);

            if (!email) {

                throw new UnauthorizedException("Token does not contain email");
      
            }
            return true;
    
        } catch (error) {

            console.log(error);
            return false;
    
        }
  
    }

}
