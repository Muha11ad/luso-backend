import { TranslationType } from "@/shared/utils/types";

export interface CharacteristicCreateReq {
    age: number;
    brand: string;
    volume: string;
    productId: string;
    expirationDate: string;
    madeIn: TranslationType;
    gender: TranslationType;
    purpose: TranslationType
    caution: TranslationType;
    skinType: TranslationType;
    ingredients: TranslationType;
    applicationTime: TranslationType;
}

export interface CharacteristicUpdateReq extends Partial<CharacteristicCreateReq> {
    id: string
}