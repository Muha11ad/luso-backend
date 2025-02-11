import { ErrorObject } from "./types";

export class MyError {
  public static SERVER_UNKNOWN_ERROR = new MyError(
    100,
    false,
    "Unknown server error"
  );
  public static NOT_FOUND = new MyError(101, true, "Item not found");
  public static BAD_REQUEST = new MyError(103, false, "Bad request");
  public static INVALID_TOKEN = new MyError(104, false, "Token invalid");
  public static UNAUTHORIZED = new MyError(105, false, "Unauthorized");
  public static DUPLICATE_NAME = new MyError(106, false, "Duplicate name");

  public static INVALID_PASSWORD = new MyError(111, true, "Invalid password");

  // Prisma-specific errors
  public static UNIQUE_CONSTRAINT_FAILED = new MyError(
    201,
    true,
    "Unique constraint failed"
  );
  public static FOREIGN_KEY_CONSTRAINT_FAILED = new MyError(
    202,
    false,
    "Foreign key constraint failed"
  );
  public static PRISMA_CLIENT_KNOWN_REQUEST_ERROR = new MyError(
    203,
    false,
    "Prisma client known error"
  );
  public static PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR = new MyError(
    204,
    false,
    "Prisma client unknown error"
  );
  public static PRISMA_CLIENT_RUST_PANIC_ERROR = new MyError(
    205,
    false,
    "Prisma client rust panic"
  );
  public static PRISMA_CLIENT_INITIALIZATION_ERROR = new MyError(
    206,
    false,
    "Prisma client initialization error"
  );
  public static PRISMA_CLIENT_VALIDATION_ERROR = new MyError(
    207,
    false,
    "Prisma client validation error"
  );

  constructor(errId: number, isFriendly: boolean, message: string) {
    this.errId = errId;
    this.message = message;
    this.isFriendly = isFriendly;
  }
  readonly errId: number;
  readonly message: string;
  readonly isFriendly: boolean;

  public static getErrorByErrId(errId: number): ErrorObject {
    switch (errId) {
      case MyError.SERVER_UNKNOWN_ERROR.errId:
        return {
          errId: MyError.SERVER_UNKNOWN_ERROR.errId,
          isFriendly: MyError.SERVER_UNKNOWN_ERROR.isFriendly,
          errMsg: MyError.SERVER_UNKNOWN_ERROR.message,
        };
      case MyError.NOT_FOUND.errId:
        return {
          errId: MyError.NOT_FOUND.errId,
          isFriendly: MyError.NOT_FOUND.isFriendly,
          errMsg: MyError.NOT_FOUND.message,
        };
      case MyError.BAD_REQUEST.errId:
        return {
          errId: MyError.BAD_REQUEST.errId,
          isFriendly: MyError.BAD_REQUEST.isFriendly,
          errMsg: MyError.BAD_REQUEST.message,
        };
      case MyError.INVALID_TOKEN.errId:
        return {
          errId: MyError.INVALID_TOKEN.errId,
          isFriendly: MyError.INVALID_TOKEN.isFriendly,
          errMsg: MyError.INVALID_TOKEN.message,
        };
      case MyError.UNAUTHORIZED.errId:
        return {
          errId: MyError.UNAUTHORIZED.errId,
          isFriendly: MyError.UNAUTHORIZED.isFriendly,
          errMsg: MyError.UNAUTHORIZED.message,
        };
      case MyError.INVALID_PASSWORD.errId:
        return {
          errId: MyError.INVALID_PASSWORD.errId,
          isFriendly: MyError.INVALID_PASSWORD.isFriendly,
          errMsg: MyError.INVALID_PASSWORD.message,
        };
      case MyError.UNIQUE_CONSTRAINT_FAILED.errId:
        return {
          errId: MyError.UNIQUE_CONSTRAINT_FAILED.errId,
          isFriendly: MyError.UNIQUE_CONSTRAINT_FAILED.isFriendly,
          errMsg: MyError.UNIQUE_CONSTRAINT_FAILED.message,
        };
      case MyError.FOREIGN_KEY_CONSTRAINT_FAILED.errId:
        return {
          errId: MyError.FOREIGN_KEY_CONSTRAINT_FAILED.errId,
          isFriendly: MyError.FOREIGN_KEY_CONSTRAINT_FAILED.isFriendly,
          errMsg: MyError.FOREIGN_KEY_CONSTRAINT_FAILED.message,
        };
      case MyError.PRISMA_CLIENT_KNOWN_REQUEST_ERROR.errId:
        return {
          errId: MyError.PRISMA_CLIENT_KNOWN_REQUEST_ERROR.errId,
          isFriendly: MyError.PRISMA_CLIENT_KNOWN_REQUEST_ERROR.isFriendly,
          errMsg: MyError.PRISMA_CLIENT_KNOWN_REQUEST_ERROR.message,
        };
      case MyError.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR.errId:
        return {
          errId: MyError.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR.errId,
          isFriendly: MyError.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR.isFriendly,
          errMsg: MyError.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR.message,
        };
      case MyError.PRISMA_CLIENT_RUST_PANIC_ERROR.errId:
        return {
          errId: MyError.PRISMA_CLIENT_RUST_PANIC_ERROR.errId,
          isFriendly: MyError.PRISMA_CLIENT_RUST_PANIC_ERROR.isFriendly,
          errMsg: MyError.PRISMA_CLIENT_RUST_PANIC_ERROR.message,
        };
      case MyError.PRISMA_CLIENT_INITIALIZATION_ERROR.errId:
        return {
          errId: MyError.PRISMA_CLIENT_INITIALIZATION_ERROR.errId,
          isFriendly: MyError.PRISMA_CLIENT_INITIALIZATION_ERROR.isFriendly,
          errMsg: MyError.PRISMA_CLIENT_INITIALIZATION_ERROR.message,
        };
      case MyError.PRISMA_CLIENT_VALIDATION_ERROR.errId:
        return {
          errId: MyError.PRISMA_CLIENT_VALIDATION_ERROR.errId,
          isFriendly: MyError.PRISMA_CLIENT_VALIDATION_ERROR.isFriendly,
          errMsg: MyError.PRISMA_CLIENT_VALIDATION_ERROR.message,
        };
      default:
        return {
          errId: MyError.SERVER_UNKNOWN_ERROR.errId,
          isFriendly: MyError.SERVER_UNKNOWN_ERROR.isFriendly,
          errMsg: MyError.SERVER_UNKNOWN_ERROR.message,
        };
    }
  }
}
