import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline/promises';
import { log } from 'console';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const appService = app.get(AppService);

  const rl = createInterface({ input: process.stdin, output: process.stdout })

  const prompt = await rl.question("What do you want to search?\n")

  const result = await appService.getPostAndComments(prompt)
  await writeFile('result.json', JSON.stringify(result))

  rl.close()

}
bootstrap();
