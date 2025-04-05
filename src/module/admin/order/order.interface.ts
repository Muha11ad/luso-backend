import { PaginationType } from "@/shared/utils/types";
import { Order, OrderStatus, Region } from "@prisma/client";



export interface OrderGetAllReq {
    pagination: PaginationType;
}

export interface OrderDetailsCreateReq {
    quantity: number;
    productId: string;
    productPrice: number;
}

export interface OrderCreateReq {
    region: Region;
    userId: string;
    firstName: string;
    status: OrderStatus;
    phoneNumber: string;
    orderDetails: OrderDetailsCreateReq[];
}

export interface OrderUpdateReq {
    id: string;
    region?: Region;
    firstName?: string;
    phoneNumber?: string;
}

export interface OrderUpdateStatusReq {
    id: string;
    status: OrderStatus;
}

export interface OrderDetailsUpdateReq {
    id: string;
    quantity?: number;
    productPrice?: number;
}

export interface OrderIdReq {
    id: string;
}

export interface OrderGetByUserIdReq {
    userId: string;
}
