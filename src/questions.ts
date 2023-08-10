import { Question, QuestionSet } from "nest-commander";
import { LogService } from "./log.service";
import { Action } from "./types";

export const SEARCH = 'search'
export const SHOW_COMMENTS = 'comments'
export const NAVIGATE_COMMENTS = 'navigate_comments'

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
    @Question({
        type: "confirm",
        message: 'do u need comments? ',
        name: 'showComments'
    })
    answer(val: boolean) {
        return val;
    }
}

@QuestionSet({ name: NAVIGATE_COMMENTS })
class NavigateComments {
    @Question({
        type: 'list',
        message: 'choose action',
        name: 'actionResult',
        choices: [
            Action.NEXT_COMMENT,
            Action.PREVIOUS_COMMENT,
            Action.NEXT_THREAD,
            Action.PREVIOUS_THREAD,
            Action.QUIT
        ]
    })
    answer(val: any) {
        return val
    }
}

export const Questions = [AskSearch, AskComments, NavigateComments]