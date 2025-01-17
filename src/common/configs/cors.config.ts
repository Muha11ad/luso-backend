import { NotAcceptableException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsOptions(): CorsOptions {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

  return {
    origin: (origin, callback) => {
      if (!origin) {
        console.log('Origin not provided');
        callback(null, "");
      }
      else if (allowedOrigins.includes(origin)) {
        console.log('Origin allowed:', origin);
        callback(null, origin);
      } 
      else {
        console.log('Origin not allowed:', origin);
        callback(new NotAcceptableException(`Origin ${origin} is not allowed`));
      }
    },
    credentials: true,
  };
}
