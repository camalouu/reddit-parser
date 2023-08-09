import { Question, QuestionSet } from "nest-commander";
import { LogService } from "./log.service";

export const SEARCH = 'search'
export const SHOW_COMMENTS = 'comments'

@QuestionSet({ name: SEARCH })
class AskSearch {
    @Question({
        message: 'What do you want to search?',
        name: 'prompt'
    })
    parseTask(val: string) {
        return val;
    }
}

@QuestionSet({ name: SHOW_COMMENTS })
class AskComments {
    constructor(private readonly logService: LogService) { }
    @Question({
        type: "confirm",
        message: 'do u need comments? ',
        name: 'showComments'
    })
    answer(val: boolean) {
        this.logService.log("val from answer=>  " + val)
        return val;
    }
}


export const Questions = [AskSearch, AskComments]