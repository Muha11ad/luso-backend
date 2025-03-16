import { Product } from "@prisma/client";

export interface RecommendationGeneratorReq {
    age: string;
    userId: string;
    purpose: string;
    userLang: string
    skinType: string;
    products: Product[];
}