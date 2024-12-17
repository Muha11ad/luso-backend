import * as sharp from 'sharp';
import { ErrorTypes } from '@/types';
import { BadRequestException } from '@nestjs/common';

async function checkFileFormat(file: Express.Multer.File) {
  try {
    const metadata = await sharp(file.buffer).metadata();
    if (!['jpeg', 'png', 'webp'].includes(metadata.format)) {
      throw new BadRequestException(ErrorTypes.UNSUPPORTED_FILE_FORMAT);
    }
  } catch (error) {
    throw new BadRequestException(ErrorTypes.ERROR_CONVERTING_FILE);
  }
}

export async function convertImageToWebP(file: Express.Multer.File): Promise<Buffer> {
  try {
    await checkFileFormat(file);
    return await sharp(file.buffer).webp({ quality: 80 }).toBuffer();
  } catch (error) {
    throw new BadRequestException(ErrorTypes.ERROR_CONVERTING_FILE);
  }
}
