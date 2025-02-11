import { IsNotEmpty, IsArray, ArrayNotEmpty } from "class-validator";

export class AddProductToCategoryDto {

    @IsArray()
    @IsNotEmpty()
    @ArrayNotEmpty()
        productIds: string[];

}
