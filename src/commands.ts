import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { LogService } from './log.service';
import { ParseService } from './parser.service';
import { COMMENTS_OR_NEXT_POST, SEARCH, NAVIGATE_COMMENTS } from './questions';
import { StoreService } from './store.service';
import { Action, Indexes } from './types';

@Command({
    name: 'rdt',
    description: 'results of a reddit search',
    arguments: '[query]',
    options: { isDefault: true }
})
export class RedditQuery extends CommandRunner {
    constructor(
        private readonly logService: LogService,
        private readonly parseService: ParseService,
        private readonly inquirer: InquirerService,
        private readonly storeService: StoreService
    ) {
        super()
    }
    async run(passedParam: string[], options?: any): Promise<void> {
        let userInput = passedParam.join(' ')
        if (!userInput) {
            const { prompt } =
                await this.inquirer.ask<{ prompt: string }>(SEARCH, {})
            userInput = prompt
        }

        const urls = await this.parseService.searchPosts(userInput)

        for (let url of urls) {
            const post = await this.parseService.getPost(url)
            this.logService.printPostDetailes(post)
            const { actionResult } =
                await this.inquirer.ask<{ actionResult: Action }>(COMMENTS_OR_NEXT_POST, {})
            switch (actionResult) {
                case Action.QUIT:
                    return;
                case Action.NEXT_POST:
                    continue;
                case Action.SHOW_COMMENTS:
                    const indexes: Indexes = { commentIdx: 0, threadIdx: 0 }
                    this.logService.log(this.storeService.getFirstComment(post))
                    let i = 1
                    while (i++) {
                        const { actionResult } =
                            await this.inquirer.ask<{ actionResult: Action }>(NAVIGATE_COMMENTS, {})
                        switch (actionResult) {
                            case Action.NEXT_COMMENT:
                                this.logService.log(
                                    this.storeService.nextComment(post.comments, indexes)
                                )
                                break;
                            case Action.NEXT_THREAD:
                                this.logService.log(
                                    this.storeService.nextThread(post.comments, indexes)
                                )
                                break;
                            case Action.NEXT_POST:
                                i = 0;
                                break;
                            case Action.QUIT:
                                return
                        }
                    }
            }
        }
    }
}