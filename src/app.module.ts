import { Module } from '@nestjs/common';
import { AskQuestion, RedditQuery } from './commands';
import { LogService } from './log.service';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [RedditQuery, AppService, AskQuestion, LogService],
})

export class AppModule { }
