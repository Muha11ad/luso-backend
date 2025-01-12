import { NotAcceptableException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export function getCorsOptions(): CorsOptions {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  console.log(allowedOrigins);

  return {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new NotAcceptableException(`Origin ${origin} is not allowed`));
      }
    },
    optionsSuccessStatus: 401,
  };
}
