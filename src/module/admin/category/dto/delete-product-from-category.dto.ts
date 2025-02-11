import { IsArray, IsNotEmpty } from "class-validator";

export class DeleteProductFromCategoryDto {

    @IsNotEmpty()
    @IsArray()
    productIds: string[];

}
