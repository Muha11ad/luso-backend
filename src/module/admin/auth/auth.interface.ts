export interface AuthValidateReq {
    email: string;
    password: string;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface AuthRefreshReq {
    refreshToken: string;
}