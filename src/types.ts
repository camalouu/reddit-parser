
export interface Comment {
    content: string,
    children: Array<Comment>
}

export type FlattenedComments = Array<Array<string>>

export enum Action {
    NEXT_COMMENT,
    PREVIOUS_COMMENT,
    NEXT_THREAD,
    PREVIOUS_THREAD,
    QUIT
}

export interface RedditPostEntity {
    data: {
        children: Array<RedditPostEntity>
        body: string
        replies?: RedditPostEntity
        selftext?: string
    }
}


export interface Post {
    link: string
    title: string
    postContent: string
    comments: FlattenedComments
}