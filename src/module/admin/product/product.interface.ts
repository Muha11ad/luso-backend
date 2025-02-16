import { TranslationType } from "@/shared/utils/types";

export interface ProductCreateReq {
    name: string;
    price: number;
    images: string[];
    discount?: number;
    available: boolean;
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
    skinType: string;
}

export interface ProductDeleteImageReq {
    imageIds: string[];
}
