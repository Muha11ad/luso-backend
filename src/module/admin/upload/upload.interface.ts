import { FolderName } from "@/shared/utils/enums";
import { FilesType, FileType } from "@/shared/utils/types";

export interface UploadDeleteFileReq {
    folder: FolderName;
    fileName: string;
}

export interface UploadDeleteMultipleFilesReq {
    folder: FolderName;
    fileNames: string[];
}

export interface UploadMultipliFilesReq {
    folder: FolderName;
    files: FilesType;
}

export interface UploadFileReq {
    folder: FolderName;
    file: FileType;
}