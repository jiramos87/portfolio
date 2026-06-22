import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';

export interface LeadMeta {
  ipHash?: string;
  userAgent?: string;
}

@Injectable()
export class ContactService {
  private readonly logger = new Logger(ContactService.name);

  constructor(private readonly prisma: PrismaService) {}

  async submit(dto: CreateLeadDto, meta: LeadMeta) {
    // Honeypot tripped: pretend success, store nothing.
    if (dto.company && dto.company.trim().length > 0) {
      this.logger.warn('Contact honeypot triggered; dropping submission');
      return { ok: true };
    }

    await this.prisma.lead.create({
      data: {
        name: dto.name,
        email: dto.email,
        message: dto.message,
        ipHash: meta.ipHash,
        userAgent: meta.userAgent,
      },
    });
    return { ok: true };
  }
}
