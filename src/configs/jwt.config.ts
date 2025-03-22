import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({

    accessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
    refreshExpires: process.env.JWT_REFRESH_EXPIRES || "7d",
    accessSecret: process.env.JWT_ACCESS_SECRET || "defaultSecret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "defaultRefreshSecret"

}))

export const JWT_CONFIG_KEYS = {
    accessExpires: "jwt.accessExpires",
    refreshExpires: "jwt.refreshExpires",
    accessSecret: "jwt.accessSecret",
    refreshSecret: "jwt.refreshSecret"
}