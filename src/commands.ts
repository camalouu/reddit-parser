import { Command, CommandRunner, InquirerService } from 'nest-commander';
import { LogService } from './log.service';
import { ParseService } from './parser.service';
import { COMMENTS_OR_NEXT_POST, SEARCH, NAVIGATE_COMMENTS } from './questions';
import { StoreService } from './store.service';
import { Action } from './types';

@Command({
    name: 'redprompt',
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

    async navigate() {
        const cm = this.storeService.getCurrentComment()
        this.logService.log(cm)
        let userAnswer: string
        do {
            const { actionResult } = await this.inquirer.ask(NAVIGATE_COMMENTS, {})
            userAnswer = actionResult
            switch (actionResult) {
                case Action.NEXT_COMMENT:
                    this.logService.log(this.storeService.nextComment()); break;
                case Action.PREVIOUS_COMMENT:
                    this.logService.log(this.storeService.previousComment()); break;
                case Action.NEXT_THREAD:
                    this.logService.log(this.storeService.nextThread()); break;
                case Action.PREVIOUS_THREAD:
                    this.logService.log(this.storeService.previousThread()); break;
            }
        } while (userAnswer != Action.QUIT)

    }

    showPost() {
        const link = this.storeService.getLink()
        const title = this.storeService.getTitle()
        const postContent = this.storeService.getPostContent()
        this.logService.log({ link, title, postContent })
    }

    async run(passedParam: string[], options?: any): Promise<void> {
        let userPrompt: string = passedParam.join(' ')
        if (!userPrompt) {
            const { prompt } = await this.inquirer.ask(SEARCH, {})
            userPrompt = prompt
        }
        await this.parseService.getPostAndSave(userPrompt)
        this.showPost()
        const { showComments } = await this.inquirer.ask(COMMENTS_OR_NEXT_POST, {})
        if (showComments == Action.SHOW_COMMENTS) {
            this.navigate()
        } else {
            this.logService.log("NOT IMPLEMENTED")
        }
    }
}