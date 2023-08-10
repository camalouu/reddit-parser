import { LoggerService } from '@nestjs/common';

export class LogService implements LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log("\n")
        console.log(message)
        console.log("\n")
    }

    /**
     * Write an 'error' level log.
     */
    error(message: any, ...optionalParams: any[]) { }

    /**
     * Write a 'warn' level log.
     */
    warn(message: any, ...optionalParams: any[]) { }

    /**
     * Write a 'debug' level log.
     */
    debug?(message: any, ...optionalParams: any[]) { }

    /**
     * Write a 'verbose' level log.
     */
    verbose?(message: any, ...optionalParams: any[]) { }
}