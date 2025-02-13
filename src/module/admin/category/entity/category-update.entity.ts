import { CategoryUpdateDto } from "../dto";
import { Category, Prisma } from "@prisma/client";
import { TranslationType } from "@/shared/utils/types";
import { updateTranslation } from "@/shared/utils/helpers";

export class CategoryUpdateEntity {
  private readonly name: TranslationType | null = null;
  private readonly description: TranslationType | null = null;

  constructor(oldData: Category, newData: CategoryUpdateDto) {

    if (newData?.name) {
    
      this.name = updateTranslation(oldData.name as TranslationType , newData.name);
    
    }
    
    if (newData?.description) {
    
      this.description = updateTranslation(
        oldData.description as TranslationType,
        newData.description
      );
    
    }
  }

  toPrisma(): Prisma.CategoryUpdateInput {
    const { name, description } = this;
    return {
      name,
      description,
    };
  }
}
