import sharp from "sharp";
import * as bcrypt from "bcrypt";
import { MyError } from "./error";
import { FILE_FORMAT } from "./consts";
import { BadRequestException } from "@nestjs/common";
import { FileType, HttpResponse, PaginationType, TranslationType } from "./types";
import { PaginationDto } from "@/module/admin/order/dto/pagination.dto";

export function setResult(data: any, errorId: number): HttpResponse {

  if (!errorId) return { data: data, error: null, success: true };

  const { errId, errMsg, isFriendly } = MyError.getErrorByErrId(errorId);

  return { data: null, error: { errId: errId, isFriendly: isFriendly, errMsg: data ?? errMsg }, success: false };
}

async function checkFileFormat(file: FileType): Promise<void> {

  try {

    const metadata = await sharp(file.buffer).metadata();

    if (!FILE_FORMAT.has(metadata.format)) throw new BadRequestException('Only PNG, JPEG/JPG, and WEBP, files are allowed!');

  } catch (error) {

    throw new BadRequestException(error.message);

  }

}

export async function convertImageToWebP(file: FileType): Promise<Buffer> {

  try {

    await checkFileFormat(file);

    return await sharp(file.buffer).webp({ quality: 80 }).toBuffer();

  } catch (error) {

    throw new BadRequestException(error.message);

  }

}

export function createTranslation(translation: TranslationType): TranslationType {

  return {
    uz: translation?.uz,
    ru: translation?.ru,
    en: translation?.en,
  };

}

export function updateTranslation(translation: TranslationType, data: Partial<TranslationType>): TranslationType {

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

export function isPasswordValid(password: string, hashPassword: string): boolean {
  return bcrypt.compareSync(password, hashPassword);
}

export function handlePagination(query: PaginationDto): PaginationType {

  query.page = Number(query.page) || 1;
  query.perPage = Number(query.perPage) || 10;

  const offset = query.perPage * (query.page - 1);

  return {
    limit: query.perPage,
    offset: offset
  };

}
