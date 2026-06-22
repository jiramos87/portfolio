import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from '../app.module';
import { ActivityService } from '../activity/activity.service';

/**
 * Pull live GitHub activity and write a real ActivitySnapshot.
 *
 * Run: `pnpm --filter api activity:refresh`
 * Requires GITHUB_TOKEN + GITHUB_REPO_TOKEN in apps/api/.env and a reachable
 * Postgres (local: docker compose, port 5433).
 */
async function main() {
  const logger = new Logger('refresh-activity');
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const activity = app.get(ActivityService);
    const result = await activity.refresh();

    logger.log(`Wrote snapshot ${result.id}`);
    logger.log(`Total contributions: ${result.totalContributions}`);
    logger.log('Curated primary stacks:');
    for (const stack of result.languages) {
      logger.log(`  ${stack.name}`);
    }
  } finally {
    await app.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
