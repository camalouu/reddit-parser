import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { search } from 'googlethis'

interface Comment {
  content: string,
  children: Array<Comment>
}

interface FlatComment {
  content: string[],
}


enum Action {
  PREVIOUS,
  NEXT,
  PARENT,
  CHILD
}

interface RedditPostEntity {
  data: {
    children: Array<RedditPostEntity>
    body: string
    replies?: RedditPostEntity
    selftext?: string
  }
}

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService
  ) { }

  async searchPosts(prompt: string) {
    const { results } = await search(prompt)
    return results.map(r => r.url)
  }

  *traverseComments(
    comments: Array<Comment>, //all comments
    position: Array<Action>, // current position from the first comment
    idxHoriz: number,
    idxVert: number,
  ): Generator<Comment> {
    if (position.length <= 0) {
      return
    }
    switch (position[0]) {
      case Action.NEXT:
        yield comments[++idxHoriz];
      case Action.PREVIOUS:
        yield comments[--idxHoriz]
      case Action.CHILD:
        yield comments[idxHoriz].children[0]
      case Action.PARENT:
        return comments

    }

  }

  parseWithFlatten(obj: RedditPostEntity, res: Array<FlatComment> = []): Array<FlatComment> {
    obj.data.children.forEach(el => {
      const content = this.beautyfy(el.data.body)
      if (el.data.replies) {
        const childComments = this.parseWithFlatten(el.data.replies, res)
        const childs = childComments.reduce((a, b) => {
          return [...a, ...b.content]
        }, [])

        res = [...res, { content: [content, ...childs] }]
      }
      res = [...res, { content: [content] }]
    })
    return res
  }

  //recursively get comments
  parseNestedComments(obj: RedditPostEntity): Array<Comment> {
    return obj.data.children.map(el => {
      const content = this.beautyfy(el.data.body)
      let children: Array<Comment> = []
      if (el.data.replies) {
        children = this.parseNestedComments(el.data.replies)
      }
      return { content, children }
    })
  }

  beautyfy(str: string): string {
    return str ? str.trim().split('\n').join(' ') : ""
  }

  async getPostAndComments(prompt: string) {
    prompt = prompt + ' site:reddit.com'
    const urls = await this.searchPosts(prompt)
    const randUrl = urls[Math.floor(Math.random() * 9)]
    //@ts-ignore
    const { data: pageDataAsJson } = await this.httpService.axiosRef.get(randUrl + '.json')
    const post = this.beautyfy(pageDataAsJson[0].data.children[0].data.selftext)
    return {
      post,
      comments: this.parseWithFlatten(pageDataAsJson[1]),
      link: randUrl
    }
  }
}