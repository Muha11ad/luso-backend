import { OrderStatus, Region } from "@prisma/client";



export interface OrderDetailsCreateReq {
    quantity: number;
    productPrice: number;
    productId: string;
    productName: string;
}

export interface OrderCreateReq {
    region: Region;
    status: OrderStatus;
    userId: number;
    phoneNumber: string;
    firstName: string;
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
    userId: number;
}
