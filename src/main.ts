import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

import { getCommitInfo } from './api/api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(express.static(join(__dirname, '..', 'public')));

  const { local_commit, repo_commit, recent_commit } = await getCommitInfo();
  process.env.REPO_COMMIT_HASH = repo_commit;
  process.env.CURRENT_COMMIT_HASH = local_commit;
  process.env.RECENT_COMMIT = recent_commit;

  app.use((req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(join(__dirname, '..', 'public', 'index.html'));
    } else {
      next();
    }
  });

  await app.listen(3000);
}
bootstrap();
