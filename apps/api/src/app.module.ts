import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProjectsModule } from './projects/projects.module';
import { ActivityModule } from './activity/activity.module';
import { ContactModule } from './contact/contact.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    // Global rate limit: 60 req/min/IP (contact tightens this to 5/min).
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 60 }]),
    // Drives the nightly GitHub activity refresh (see ActivityCron).
    ScheduleModule.forRoot(),
    PrismaModule,
    ProjectsModule,
    ActivityModule,
    ContactModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
