import { Module } from '@nestjs/common';
import { RedditQuery } from './commands';
import { LogService } from './log.service';
import { ParseService } from './parser.service';
import { HttpModule } from '@nestjs/axios';
import { Questions } from './questions';
import { StoreService } from './store.service';

@Module({
  imports: [HttpModule],
  providers: [RedditQuery, ParseService, LogService, ...Questions, StoreService],
})

export class AppModule { }
