import { PartialType } from "@nestjs/mapped-types";
import { CategoryCreateDto } from "./create-category.dto";

export class CategoryUpdateDto extends PartialType(CategoryCreateDto) {}
