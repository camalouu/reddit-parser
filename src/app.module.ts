import { Module } from '@nestjs/common';
import { RedditQuery } from './commands';
import { LogService } from './log.service';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { Questions } from './questions';

@Module({
  imports: [HttpModule],
  providers: [RedditQuery, AppService, LogService, ...Questions],
})

export class AppModule { }
