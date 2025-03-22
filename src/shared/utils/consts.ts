export const ENDPOINTS = {
    auth: "auth",
    user: "user",
    order: "order",
    upload: "upload",
    product: "product",
    category: "category",
    characteristic: "characteristic",
    recommendation: "recommendation",
}

export const REDIS_ENDPOINT_KEYS = {
    userAll: "api/user/all",
    ordersAll: "api/order/all",
    productById: "api/product",
    categoryById: "api/category",
    productAll: "api/product/all",
    categoryAll: "api/category/all",
}

export const REFRESH_TOKEN_KEY = "refreshToken"


// for look ups
export const RECOMMENDATION_EXCLUDED_USERS = new Set([
    '6864991736',
    '1549244915',
    '609888174',
    '7134231329',
    '968954832',
    '648172579',
]);

export const ALLOWED_MIME_TYPES = new Set(["image/jpeg", "image/png"]);

export const FILE_FORMAT = new Set(["jpeg", "png", "webp"]);
