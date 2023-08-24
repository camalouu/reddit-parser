import { LoggerService } from '@nestjs/common';
import { Post } from './types';

export class LogService implements LoggerService {
    /**
     * Write a 'log' level log.
     */
    log(message: any, ...optionalParams: any[]) {
        console.log('\x1b[33m%s\x1b[0m', `${message}\n`)
    }

    printPostDetailes(post: Post) {
        console.log('\x1b[32m%s\x1b[0m', `TITLE => ${post.title}\n`)
        console.log('\x1b[35m%s\x1b[0m', `CONTENT => ${post.postContent}\n`)
        console.log('\x1b[36m%s\x1b[0m', `LINK => ${post.link}\n`)
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