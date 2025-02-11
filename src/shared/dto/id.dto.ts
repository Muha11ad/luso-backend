import { IsUUID } from "class-validator";

export class ReqIdDto {

    @IsUUID()
        id: string;

}
