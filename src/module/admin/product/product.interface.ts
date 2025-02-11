import { TranslationType } from "@/shared/utils/types";

export interface ProductCreateReq {
    name: string;
    price: number;
    available: boolean;
    discount?: number;
    instruction: TranslationType
}

export interface ProductUpdateReq extends Partial<ProductCreateReq> {
    id: string;
}

export interface ProductCategoryAddReq {
    id: string;
    categoryIds: string[];
}

export interface ProductCategoryDeleteReq {
    id: string,
    categoryId: string
}

export interface ProductsFilterReq {
    age: string;
    purpose: string;
    skin_type: string;
}