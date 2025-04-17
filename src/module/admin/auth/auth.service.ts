import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MyError } from "@/shared/utils/error";
import { TOKEN_KEYS } from "@/shared/utils/consts";
import { BaseResponse } from "@/shared/utils/types";
import { AuthTokens, AuthValidateReq } from "./auth.interface";
import { DatabaseProvider, RedisProvider } from "@/shared/providers";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";

@Injectable()
export class AuthService {

  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly database: DatabaseProvider,
    private readonly redisService: RedisProvider,
  ) { }

  public async validate(reqData: AuthValidateReq): Promise<BaseResponse<AuthTokens>> {

    try {


      const isEmailExist = await this.database.admin.findUniqueOrThrow({ where: { email: reqData.email } });

      const comparePassword = await bcrypt.compare(reqData.password, isEmailExist.password);

      if (!comparePassword) return { errId: MyError.INVALID_PASSWORD.errId, data: null };

      let access = await this.redisService.get<string>(TOKEN_KEYS.acccessToken);
      let refresh = await this.redisService.get<string>(TOKEN_KEYS.refreshToken);

      if (access) {
        
        return { errId: null, data: { access, refresh } };

      }

      access = this.generateAccessToken(reqData.email);
      refresh = this.generateRefreshToken(reqData.email);

      await this.redisService.setex(TOKEN_KEYS.acccessToken, access, 60 * 60 * 23);
      await this.redisService.setex(TOKEN_KEYS.refreshToken, refresh, 60 * 60 * 24 * 6);

      return { errId: null, data: { access, refresh } };

    } catch (error) {

      return ServiceExceptions.handle(error, AuthService.name, this.validate.name);

    }
  }

  private generateAccessToken(email: string): string {

    const { accessExpires, accessSecret } = this.config.get("jwt");


    return this.jwtService.sign({ email }, { secret: accessSecret, expiresIn: accessExpires });

  }

  private generateRefreshToken(email: string): string {

    const { refreshExpires, refreshSecret } = this.config.get("jwt");

    return this.jwtService.sign({ email }, { secret: refreshSecret, expiresIn: refreshExpires });

  }

}
