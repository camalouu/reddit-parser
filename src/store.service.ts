import { Injectable } from '@nestjs/common';
import { Post } from './types';

@Injectable()
export class StoreService {
    private post: Post
    private threadIdx: number = 0
    private commentIdx: number = 0

    setPost(newPost: Post) {
        this.post = newPost
    }
    getTitle() {
        return this.post.title
    }
    getPostContent() {
        return this.post.postContent
    }
    getLink() {
        return this.post.link
    }
    getCurrentComment() {
        if (this.post.comments.length)
            return this.post.comments[this.threadIdx][this.commentIdx]
        return null
    }
    private moveComment(move: 1 | -1) {
        const idx = this.commentIdx + move
        const comment = this.post.comments[this.threadIdx][idx]
        if (comment) {
            this.commentIdx += move
            return comment
        }
        return null
    }
    private moveThread(move: 1 | -1) {
        const idx = this.threadIdx + move
        if (idx < this.post.comments.length) {
            this.threadIdx += move
            return this.post.comments[this.threadIdx][0]
        }
        return null
    }
    nextComment() {
        return this.moveComment(1)
    }
    previousComment() {
        return this.moveComment(-1)
    }
    nextThread() {
        return this.moveThread(1)
    }
    previousThread() {
        return this.moveThread(-1)
    }
}