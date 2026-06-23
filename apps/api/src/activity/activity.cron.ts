import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ActivityService } from './activity.service';

/**
 * Nightly GitHub activity refresh. Keeps the contribution snapshot current
 * without a manual `activity:refresh`. Runs inside the always-on API process,
 * so no separate Railway cron service is needed.
 *
 * Explicit @Inject mirrors ActivityService: the refresh-activity script boots
 * AppModule under tsx (no emitted decorator metadata), so constructor DI needs
 * the token spelled out.
 */
@Injectable()
export class ActivityCron {
  private readonly logger = new Logger(ActivityCron.name);

  constructor(
    @Inject(ActivityService) private readonly activity: ActivityService,
  ) {}

  // 06:00 daily, container TZ (UTC on Railway).
  @Cron(CronExpression.EVERY_DAY_AT_6AM, { name: 'activity-refresh' })
  async nightlyRefresh() {
    this.logger.log('Nightly activity refresh starting…');
    try {
      const { totalContributions } = await this.activity.refresh();
      this.logger.log(
        `Nightly activity refresh done: totalContribs=${totalContributions}`,
      );
    } catch (err) {
      // Swallow: a failed nightly pull must not crash the API; the last good
      // snapshot stays served until the next run.
      this.logger.error(
        `Nightly activity refresh failed: ${(err as Error).message}`,
      );
    }
  }
}
