import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { search } from 'googlethis'
import { FlattenedComments, RedditPostEntity, Comment, Post } from './types';

@Injectable()
export class ParseService {
  constructor(private readonly httpService: HttpService) { }
  private beautyfy(str: string): string {
    return str ? str.trim().split('\n').join(' ') : "[Not Available]"
  }
  async searchPosts(prompt: string) {
    const { results } = await search(prompt + ' site:reddit.com')
    return results.map(r => r.url)
  }

  async getPost(link: string): Promise<Post> {
    // @ts-ignore
    const { data: pageDataAsJson } =
      await this.httpService.axiosRef.get(link + '.json')
    const postContent = this.beautyfy(pageDataAsJson[0].data.children[0].data.selftext)
    const title = this.beautyfy(pageDataAsJson[0].data.children[0].data.title)
    const comments = this.parseAndFlatten(pageDataAsJson[1])
    return { postContent, title, link, comments }
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
}