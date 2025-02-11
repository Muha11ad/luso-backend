import { Prisma } from "@prisma/client";
import { Logger } from "@nestjs/common";
import { MyError } from "../utils/error";

export class ServiceExceptions {
    
    static logger = new Logger("ServiceExceptions");
    
    private static handlePrismaKnownError(e: Prisma.PrismaClientKnownRequestError) {
        switch (e.code) {
            case "P2002": 
                return {
                    errId: MyError.UNIQUE_CONSTRAINT_FAILED.errId,
                    data: null
                };
            case "P2003": 
                return {
                    errId: MyError.FOREIGN_KEY_CONSTRAINT_FAILED.errId,
                    data: null
                };
            case "P2025": 
                return {
                    errId: MyError.NOT_FOUND.errId,
                    data: null
                };
            default:
                return {
                    errId: MyError.PRISMA_CLIENT_KNOWN_REQUEST_ERROR.errId,
                    data: null
                };
        }
    }
    
    static handle(e: any, serviceName: string, methodName: string) {

        // Handle Prisma errors
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            return this.handlePrismaKnownError(e);
        }
        if (e instanceof Prisma.PrismaClientUnknownRequestError) {
            return {
                errId: MyError.PRISMA_CLIENT_UNKNOWN_REQUEST_ERROR.errId,
                data: null
            };
        }
        if (e instanceof Prisma.PrismaClientRustPanicError) {
            return {
                errId: MyError.PRISMA_CLIENT_RUST_PANIC_ERROR.errId,
                data: null
            };
        }
        if (e instanceof Prisma.PrismaClientInitializationError) {
            return {
                errId: MyError.PRISMA_CLIENT_INITIALIZATION_ERROR.errId,
                data: null
            };
        }
        if (e instanceof Prisma.PrismaClientValidationError) {
            return {
                errId: MyError.PRISMA_CLIENT_VALIDATION_ERROR.errId,
                data: null
            };
        }

        // Default handling
        if (e.errId) {
            return {
                errId: e.errId,
                data: null
            };
        }

        this.logger.error(`Service: [${serviceName}], method: [${methodName}], Error: ${e}`);
        throw e;
    }

}
