import { Module } from '@nestjs/common';
import { RedditQuery } from './commands';
import { LogService } from './log.service';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { Questions } from './questions';
import { StoreService } from './store.service';

@Module({
  imports: [HttpModule],
  providers: [RedditQuery, AppService, LogService, ...Questions, StoreService],
})

export class AppModule { }
