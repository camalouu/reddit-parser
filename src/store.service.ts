import { Injectable } from '@nestjs/common';
import { FlattenedComments, Indexes, Post } from './types';
import { writeFileSync } from 'fs';

@Injectable()
export class StoreService {
    getFirstComment(post: Post) {
        writeFileSync('parse_result.json', JSON.stringify(post))
        if (post.comments.length)
            return post.comments[0][0]
        throw new Error("no post exist but tried to access")
    }
    nextComment(comments: FlattenedComments, idx: Indexes) {
        const cmnt = comments[idx.threadIdx][idx.commentIdx + 1]
        if (cmnt) {
            return cmnt
        }
        return comments[idx.threadIdx][idx.commentIdx--]
    }
    nextThread(comments: FlattenedComments, threadIdx: number) {
        const idx = threadIdx + 1
        if (idx < comments.length) {
            return comments[threadIdx][0]
        }
        throw new Error("tried to access nonexistent thread")
    }
}