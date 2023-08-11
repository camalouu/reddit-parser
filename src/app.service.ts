import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { search } from 'googlethis'
import { FlattenedComments, RedditPostEntity, Comment } from './types';
import { StoreService } from './store.service';

@Injectable()
export class AppService {
  constructor(
    private readonly httpService: HttpService,
    private readonly storeService: StoreService
  ) { }

  private async searchPosts(prompt: string) {
    const { results } = await search(prompt)
    return results.map(r => r.url)
  }

  //todo: data.distinguished is a bot
  private parseAndFlatten(obj: RedditPostEntity): FlattenedComments {
    let res: FlattenedComments = []
    obj.data.children.forEach(el => {
      const comment = this.beautyfy(el.data.body)
      if (el.data.replies) {
        const childComments = this.parseAndFlatten(el.data.replies)
        const childs = childComments.reduce((a, b) => {
          return [...a, ...b]
        }, [])
        res.push([comment, ...childs])
      } else {
        res.push([comment])
      }
    })
    return res
  }

  // recursively get comments
  private parseNestedComments(obj: RedditPostEntity): Array<Comment> {
    return obj.data.children.map(el => {
      const content = this.beautyfy(el.data.body)
      let children: Array<Comment> = []
      if (el.data.replies) {
        children = this.parseNestedComments(el.data.replies)
      }
      return { content, children }
    })
  }

  private beautyfy(str: string): string {
    return str ? str.trim().split('\n').join(' ') : ""
  }

  async getPostAndSave(prompt: string) {
    prompt = prompt + ' site:reddit.com'
    const urls = await this.searchPosts(prompt)
    const link = urls[Math.floor(Math.random() * 9)]
    //@ts-ignore
    const { data: pageDataAsJson } = await this.httpService.axiosRef.get(link + '.json')
    const postContent = this.beautyfy(pageDataAsJson[0].data.children[0].data.selftext)
    const title = this.beautyfy(pageDataAsJson[0].data.children[0].data.title)
    const comments = this.parseAndFlatten(pageDataAsJson[1])

    this.storeService.setPost({ postContent, title, link, comments })
  }
}