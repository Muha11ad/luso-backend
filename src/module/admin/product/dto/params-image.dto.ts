import { IsUUID } from "class-validator";

export class ParamsImageDto {

    @IsUUID()
        id: string;
    @IsUUID()
        image_id: string;

}
