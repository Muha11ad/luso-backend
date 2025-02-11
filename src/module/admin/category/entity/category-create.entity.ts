import { Prisma } from "@prisma/client";
import { CategoryCreateDto } from "../dto";
import { createTranslation } from "@/shared/utils/helpers";

export class CategoryCreateEntity {

    constructor(private readonly data: CategoryCreateDto) {}

    toPrisma(): Prisma.CategoryCreateInput {

        return {
            name: createTranslation(this.data.name),
            description: createTranslation(this.data.description)
        };
  
    }

}
