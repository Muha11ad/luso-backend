import { PaginationType } from "@/shared/utils/types"

export interface RecommendationCreateReq {
    age: string
    userId: string
    purpose: string
    skinType: string
    userLang: string
}
export interface RecommendationGetAllReq {
    pagination: PaginationType
}