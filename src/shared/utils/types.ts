export type FileType = Express.Multer.File;
export type FilesType = Express.Multer.File[];

export interface ErrorObject {
    errId: number;
    isFriendly: boolean;
    errMsg: string;
}

export type TranslationType = {
    uz: string;
    ru: string;
    en: string;
};

export interface BaseResponse<T> {
    errId?: number;
    data: T;
    total?: number;
}

export interface HttpResponse {
        data: any;
        error: ErrorObject;
        success: boolean;
}

export interface SuccessRes {
    success: boolean;
}

export interface IdReq {
    id: string;
}

export interface UserIdReq {
    id: string;
}

