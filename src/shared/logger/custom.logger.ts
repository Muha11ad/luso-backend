import { Logger } from "@nestjs/common";
import appConfigs from "@/configs/app.configs";
import { ConfigService } from "@nestjs/config";

const logConfigService = new ConfigService({ app: appConfigs() });

export class CustomLogger extends Logger {
    
    constructor(private className: string) {

        super(className);
    
    }
    
    log(message: string, context?: string): void {
        
        if (logConfigService.get("app.log.info")) {
            
            const arrArgs = [message];
            if(context) arrArgs.push(context);
            
            super.log.apply(this, arrArgs);
            
        }
        
    }
    
    error(message: string, stack?: string, context?: string): void {
        
        if (logConfigService.get("app.log.error")) {

            const arrArgs = [message];
            if(stack) arrArgs.push(stack);
            if(context) arrArgs.push(context);
    
            super.error.apply(this, arrArgs);
            
        }
        
    }
    
    warn(message: string, context?: string): void {
        
        if (logConfigService.get("app.log.warn")) {
    
            const arrArgs = [message];
            if(context) arrArgs.push(context);
    
            super.warn.apply(this, arrArgs);
            
        }
        
    }
    
    debug(message: string, context?: string): void {
        
        if (logConfigService.get("app.log.debug")) {
            
            const arrArgs = [message];
            if(context) arrArgs.push(context);
    
            super.debug.apply(this, arrArgs);
            
        }
        
    }
    
    verbose(message: string, context?: string): void {
        
        const arrArgs = [message];
        if(context) arrArgs.push(context);
    
        super.verbose.apply(this, arrArgs);
        
    }
    
}