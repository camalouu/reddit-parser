import { LoggerService } from '@nestjs/common';
import { Post } from './types';

export class LogService implements LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log("\n")
        console.log(message)
        console.log("\n")
    }

    printPostDetailes(post: Post) {
        console.log('\x1b[36m%s\x1b[0m', `LINK => ${post.link}`)
        console.log('\x1b[32m%s\x1b[0m', `TITLE => ${post.title}`)
        console.log('\x1b[35m%s\x1b[0m', `CONTENT => ${post.postContent}`)
        // this.log("TITLE => ", post.title)
        // this.log("CONTENT => ", post.postContent)
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