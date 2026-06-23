import { Module } from '@nestjs/common';
import { ActivityController } from './activity.controller';
import { ActivityService } from './activity.service';
import { ActivityCron } from './activity.cron';

@Module({
  controllers: [ActivityController],
  providers: [ActivityService, ActivityCron],
})
export class ActivityModule {}
