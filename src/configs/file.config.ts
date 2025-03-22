import { registerAs } from "@nestjs/config";

export default registerAs("file", () => ({
    origin: process.env.UPLOADS_ORIGIN,
    pathToUpload: process.env.PATH_TO_UPLOADS,
}))

export const FILE_CONFIG_KEYS = {
    origin: "file.origin",
    pathToUpload: "file.pathToUpload",
}