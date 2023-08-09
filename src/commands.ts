import { Command, CommandRunner, InquirerService, Option, Question, QuestionSet } from 'nest-commander';
import { LogService } from './log.service';
import { AppService } from './app.service';
import { SHOW_COMMENTS, SEARCH } from './questions';

@Command({
    name: 'redprompt',
    description: 'results of reddit searching through reddit',
    arguments: '[query]',
    options: { isDefault: true }
})
export class RedditQuery extends CommandRunner {
    constructor(
        private readonly logService: LogService,
        private readonly appService: AppService,
        private readonly inquirer: InquirerService
    ) {
        super()
    }

    async run(passedParam: string[], options?: any): Promise<void> {

        let userPrompt: string = passedParam.join(' ')

        if (!userPrompt) {
            const { prompt } = await this.inquirer.ask(SEARCH, {})
            userPrompt = prompt
        }

        const { title, post, link, comments } = await this.appService.getPostAndComments(userPrompt)

        const result: Record<string, any> = {
            link,
            title,
            post,
        }

        if (options.comments) {
            result.comments = comments
        } else {
            const { showComments } = await this.inquirer.ask<{ showComments: boolean }>(SHOW_COMMENTS, {})
            if (showComments) {
                result.comments = comments
            }
        }

        this.logService.log(
            JSON.stringify(result, null, 4)
        )
    }

    @Option({
        flags: '-c, --comments [boolean]',
        description: 'get title of the result',
    })
    showComments(val: boolean) {
        return val
    }

}