import { Command, CommandRunner, InquirerService, Option } from 'nest-commander';
import { LogService } from './log.service';
import { AppService } from './app.service';
import { SHOW_COMMENTS, SEARCH, NAVIGATE_COMMENTS } from './questions';
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
        private readonly appService: AppService,
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

    async run(passedParam: string[], options?: any): Promise<void> {

        let userPrompt: string = passedParam.join(' ')

        if (!userPrompt) {
            const { prompt } = await this.inquirer.ask(SEARCH, {})
            userPrompt = prompt
        }
        await this.appService.getPostAndSave(userPrompt)

        const link = this.storeService.getLink()
        const title = this.storeService.getTitle()
        const postContent = this.storeService.getPostContent()
        const result: Record<string, any> = {
            link,
            title,
            postContent,
        }
        this.logService.log(result)

        if (options.comments) {
            this.navigate()
        } else {
            const { showComments } = await this.inquirer.ask(SHOW_COMMENTS, {})
            if (showComments) {
                this.navigate()
            }
            this.logService.log("NOT IMPLEMENTED")
        }

    }

    @Option({
        flags: '-c, --comments [boolean]',
        description: 'get title of the result',
    })
    showComments(val: boolean) {
        return val
    }

}