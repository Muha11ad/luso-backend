import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MyError } from "@/shared/utils/error";
import { BaseResponse } from "@/shared/utils/types";
import { REFRESH_TOKEN_KEY } from "@/shared/utils/consts";
import { DatabaseProvider, RedisProvider } from "@/shared/providers";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { AuthRefreshReq, AuthTokens, AuthValidateReq } from "./auth.interface";

@Injectable()
export class AuthService {

  constructor(
    private readonly redis: RedisProvider,
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly database: DatabaseProvider,
  ) { }

  public async validate(reqData: AuthValidateReq): Promise<BaseResponse<AuthTokens>> {

    try {

      const isEmailExist = await this.database.admin.findUniqueOrThrow({ where: { email: reqData.email } });

      const comparePassword = await bcrypt.compare(reqData.password, isEmailExist.password);

      if (!comparePassword) {

        return { errId: MyError.INVALID_PASSWORD.errId, data: null };

      }

      const access = this.generateAccessToken(reqData.email);
      const refresh = this.generateRefreshToken(reqData.email);

      await this.redis.set(REFRESH_TOKEN_KEY, refresh);

      return { errId: null, data: { access, refresh } };

    } catch (error) {

      return ServiceExceptions.handle(error, AuthService.name, "validate");

    }
  }

  public async refreshToken(reqData: AuthRefreshReq): Promise<BaseResponse<string>> {

    try {


      const oldRefresh = await this.redis.get(REFRESH_TOKEN_KEY)

      if (!oldRefresh) {

        return { errId: MyError.UNAUTHORIZED.errId, data: null };

      }

      if (oldRefresh !== reqData.refreshToken) {

        return { errId: MyError.UNAUTHORIZED.errId, data: null };

      }

      const refreshSecret = this.config.get("jwt").refreshSecret

      const { email } = this.jwtService.verify(reqData.refreshToken, { secret: refreshSecret });

      const access = this.generateAccessToken(email);

      return { errId: null, data: access };


    } catch (error) {

      return ServiceExceptions.handle(error, AuthService.name, "refreshToken");

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
