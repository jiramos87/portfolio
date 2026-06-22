import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  /** Latest GitHub activity snapshot, or null if none has been captured yet. */
  getLatest() {
    return this.prisma.activitySnapshot.findFirst({
      orderBy: { capturedAt: 'desc' },
    });
  }
}
