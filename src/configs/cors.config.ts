import { NotAcceptableException } from "@nestjs/common";
import { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export function getCorsOptions(): CorsOptions {

    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];


    return {
        origin: (origin, callback) => {

            if (!origin) {

                callback(null, false);
      
            } else if (allowedOrigins.includes(origin)) {

                callback(null, origin);
      
            } else {

                callback(new NotAcceptableException(`Origin ${origin} is not allowed`));
      
            }
    
        },
        credentials: true
    };

}
