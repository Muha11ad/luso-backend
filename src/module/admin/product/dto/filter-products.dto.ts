import { IsNotEmpty, IsString } from "class-validator";

export class FilterProductsDto {

    @IsNotEmpty()
    @IsString()
    age: string;
    
    @IsNotEmpty()
    @IsString()
    skin_type: string;
    
    @IsNotEmpty()
    @IsString()
        purpose: string;

}
