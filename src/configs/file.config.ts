import { registerAs } from "@nestjs/config";

export default registerAs("file", () => ({
    origin: process.env.UPLOADS_ORIGIN,
    pathToUpload: process.env.PATH_TO_UPLOADS,
}))