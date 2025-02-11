import { TranslationType } from "@/shared/utils/types";

export interface CategoryDeleteReq {
  id: string;
}

export interface CategoryCreateReq {
  name: TranslationType;
  description: TranslationType;
}

export interface CategoryUpdateReq extends Partial<CategoryCreateReq> {
  id: string;
}

export interface CategoryProductAddReq {
  id: string,
  productIds: string[]
}

export interface CategoryProductDeleteReq {
  id: string,
  productIds: string[]
}