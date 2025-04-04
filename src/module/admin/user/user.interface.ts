import { PaginationType } from "@/shared/utils/types"

export interface UserCreateReq {
    name: string
    username?: string
    telegramId: string
}

export interface UserGetAllReq {
    pagination: PaginationType
}
