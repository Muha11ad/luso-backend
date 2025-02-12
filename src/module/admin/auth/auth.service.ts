import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";
import { MyError } from "@/shared/utils/error";
import { AuthValidateReq } from "./auth.interface";
import { BaseResponse } from "@/shared/utils/types";
import { DatabaseProvider } from "@/shared/providers";
import { ServiceExceptions } from "@/shared/exceptions/service.exception";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
    private readonly database: DatabaseProvider
  ) {}

  public async validate(reqData: AuthValidateReq): Promise<BaseResponse<string>> {

    try {
    
      const isEmailExist = await this.database.admin.findUnique({
        where: { email: reqData.email },
      });
    
      if (!isEmailExist)
        return { errId: MyError.NOT_FOUND.errId, data: null };

      const comparePassword = await bcrypt.compare(
        reqData.password,
        isEmailExist.password
      );
    
      if (!comparePassword)
    
        return { errId: MyError.INVALID_PASSWORD.errId, data: null };

      const secret = this.config.get('jwt.secret');
      const token = this.jwtService.sign({ email: reqData.email }, { secret });

      return { errId: null, data: token };
    
    } catch (error) {

      return ServiceExceptions.handle(error, AuthService.name, "validate");
    
    }
  }
}
