import { Injectable } from '@nestjs/common';
import { FlattenedComments, Indexes, Post } from './types';
import { writeFileSync } from 'fs';

@Injectable()
export class StoreService {
    getFirstComment(post: Post) {
        writeFileSync('parse_result.json', JSON.stringify(post))
        if (post.comments.length)
            return post.comments[0][0]
    }
    nextComment(comments: FlattenedComments, idx: Indexes) {
        const cmnt = comments[idx.threadIdx][idx.commentIdx + 1]
        if (cmnt) {
            idx.commentIdx++
            return cmnt
        }
        return comments[idx.threadIdx][idx.commentIdx]
    }
    nextThread(comments: FlattenedComments, idx: Indexes) {
        if (idx.threadIdx + 1 < comments.length) {
            idx.commentIdx = 0
            return comments[++idx.threadIdx][idx.commentIdx]
        }
        return comments[idx.threadIdx][idx.commentIdx]
    }
}