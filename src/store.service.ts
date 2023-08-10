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
        return this.post.comments
        return this.post.comments[this.threadIdx][this.commentIdx]
    }
    nextComment() {
        const idx = this.commentIdx + 1
        const comment = this.post.comments[this.threadIdx][idx]
        if (comment) {
            this.commentIdx++
            return comment
        }
        return null
    }
    nextThread() {
        const idx = this.threadIdx + 1
        if (idx < this.post.comments.length)
            return this.post.comments[++this.threadIdx][0]
        return null
    }
    previousComment() {
        const idx = this.commentIdx - 1
        const comment = this.post.comments[this.threadIdx][idx]
        if (comment) {
            this.commentIdx--
            return comment
        }
        return null
    }
    previousThread() {
        const idx = this.threadIdx - 1
        if (idx < this.post.comments.length)
            return this.post.comments[--this.threadIdx][0]
        return null
    }
    print() {
        console.log("TEST")
    }
}