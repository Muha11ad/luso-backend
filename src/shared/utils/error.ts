import { ErrorObject } from "./types";

export class MyError {

  // Global errors
  public static SERVER_UNKNOWN_ERROR = new MyError(100, false, "Unknown server error");
  public static NOT_FOUND = new MyError(101, true, "Item not found");
  public static BAD_REQUEST = new MyError(103, false, "Bad request");
  public static INVALID_TOKEN = new MyError(104, false, "Token invalid");
  public static UNAUTHORIZED = new MyError(105, false, "Unauthorized");
  public static DUPLICATE_NAME = new MyError(106, false, "Duplicate name");
  public static INVALID_PASSWORD = new MyError(111, true, "Invalid password");

  // Prisma-specific errors
  public static UNIQUE_CONSTRAINT_FAILED = new MyError(201, true, "Unique constraint failed");
  public static FOREIGN_KEY_CONSTRAINT_FAILED = new MyError(202, false, "Foreign key constraint failed");
  public static PRISMA_CLIENT_KNOWN_REQUEST_ERROR = new MyError(203, false, "Prisma client known error");
  public static PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR = new MyError(204, false, "Prisma client unknown error");
  public static PRISMA_CLIENT_RUST_PANIC_ERROR = new MyError(205, false, "Prisma client rust panic");
  public static PRISMA_CLIENT_INITIALIZATION_ERROR = new MyError(206, false, "Prisma client initialization error");
  public static PRISMA_CLIENT_VALIDATION_ERROR = new MyError(207, false, "Prisma client validation error");

  // File-specific errors
  public static INVALID_FILE_TYPE = new MyError(208, false, "Invalid file type");
  public static EXCEEDED_FILE_SIZE = new MyError(209, false, "File size exceeds 10MB");

  constructor(public readonly errId: number, public readonly isFriendly: boolean, public readonly message: string) { }

  private static returnErrorObject(error: MyError): ErrorObject {
    return {
      errId: error.errId,
      isFriendly: error.isFriendly,
      errMsg: error.message,
    };
  }

  public static getErrorByErrId(errId: number): ErrorObject {
    const error = Object.values(MyError).find((e) => e instanceof MyError && e.errId === errId) as MyError;
    return error ? this.returnErrorObject(error) : this.returnErrorObject(MyError.SERVER_UNKNOWN_ERROR);
  }
}
