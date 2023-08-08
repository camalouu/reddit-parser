import { Command, CommandRunner, InquirerService, Option, Question, QuestionSet } from 'nest-commander';
import { LogService } from './log.service';
import { AppService } from './app.service';

interface Options {
    title?: boolean
    post?: boolean
    link?: boolean
}

@QuestionSet({ name: 'ask-question' })
export class AskQuestion {
    @Question({
        message: 'What do you want to search?',
        name: 'query'
    })
    parseTask(val: string) {
        return val;
    }
}


@Command({
    name: 'reddit',
    description: 'results of reddit query',
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

    async run(passedParam: string[], options?: Options): Promise<void> {

        let question: string = passedParam.join(' ')
        if (!question) {
            question = (await this.inquirer.ask<{query: string}>('ask-question', undefined)).query
        }

        const response = await this.appService.getPostAndComments(question)

        // this.logService.log({ passedParam, options, result })
        const result: Record<string, string> = {}

        if (options.title) result.title = response.title

        if (options.link) result.link = response.link

        if (options.post) result.post = response.post

        this.logService.log(result)

    }

    @Option({
        flags: '-t, --title [boolean]',
        description: 'get title of the result',
    })
    getTitle(val: string) {
        return val
    }

    @Option({
        flags: '-p, --post [boolean]',
        description: 'get post of the result',
    })
    getPost(val: string) {
        return val
    }

    @Option({
        flags: '-l, --link [boolean]',
        description: 'get link of the result',
    })
    getLink(val: string) {
        return val
    }
}