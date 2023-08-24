import { Question, QuestionSet } from "nest-commander";
import { Action } from "./types";

export const SEARCH = 'search'
export const COMMENTS_OR_NEXT_POST = 'comments'
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

@QuestionSet({ name: COMMENTS_OR_NEXT_POST })
class AskComments {
    @Question({
        type: "list",
        message: 'show comments or next post?',
        name: 'actionResult',
        choices: [
            Action.SHOW_COMMENTS,
            Action.NEXT_POST,
            Action.QUIT
        ]
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
            Action.NEXT_THREAD,
            Action.NEXT_POST,
            Action.QUIT
        ]
    })
    answer(val: any) {
        return val
    }
}

export const Questions = [AskSearch, AskComments, NavigateComments]