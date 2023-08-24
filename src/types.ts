
export interface Comment {
    content: string,
    children: Array<Comment>
}

export type FlattenedComments = Array<Array<string>>

export enum Action {
    NEXT_COMMENT = 'Next comment',
    PREVIOUS_COMMENT = 'Previous comment',
    NEXT_THREAD = 'Next thread',
    PREVIOUS_THREAD = 'Previous thread',
    QUIT = 'Quit',
    SHOW_COMMENTS = 'Show comments',
    NEXT_POST = 'Next post'
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

export interface Indexes {
    commentIdx: number
    threadIdx: number
}