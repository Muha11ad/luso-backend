import sharp from "sharp";
import * as bcrypt from "bcrypt";
import { MyError } from "./error";
import { FILE_FORMAT } from "./consts";
import { BadRequestException } from "@nestjs/common";
import { HttpResponse, TranslationType } from "./types";

export function setResult(data: any, errorId: number): HttpResponse {
  if (!errorId) {
    return {
      data: data,
      error: null,
      success: true,
    };
  }

  const { errId, errMsg, isFriendly } = MyError.getErrorByErrId(errorId);

  return {
    data: null,
    error: {
      errId: errId,
      isFriendly: isFriendly,
      errMsg: data ?? errMsg,
    },
    success: false,
  };
}

async function checkFileFormat(file: Express.Multer.File) {
  try {
    const metadata = await sharp(file.buffer).metadata();
    if (!FILE_FORMAT.includes(metadata.format)) {
      throw new BadRequestException("hello");
    }
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

export async function convertImageToWebP(
  file: Express.Multer.File
): Promise<Buffer> {
  try {
    await checkFileFormat(file);
    return await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
  } catch (error) {
    throw new BadRequestException(error.message);
  }
}

export function createTranslation(
  translation: TranslationType
): TranslationType {
  return {
    uz: translation?.uz,
    ru: translation?.ru,
    en: translation?.en,
  };
}

export function updateTranslation(
  translation: TranslationType,
  data: Partial<TranslationType>
): TranslationType {
  return {
    uz: data?.uz || translation.uz,
    ru: data?.ru || translation.ru,
    en: data?.en || translation.en,
  };
}

export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

export function isPasswordValid(
  password: string,
  hashPassword: string
): boolean {
  return bcrypt.compareSync(password, hashPassword);
}
