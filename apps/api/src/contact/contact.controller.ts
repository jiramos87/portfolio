import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { createHash } from 'node:crypto';
import type { Request } from 'express';
import { ContactService } from './contact.service';
import { CreateLeadDto } from './dto/create-lead.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contact: ContactService) {}

  // Tighter than the global limit: 5 submissions per minute per IP.
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @Post()
  @HttpCode(200)
  submit(@Body() dto: CreateLeadDto, @Req() req: Request) {
    const forwarded = req.headers['x-forwarded-for'];
    const rawIp = (
      Array.isArray(forwarded) ? forwarded[0] : (forwarded ?? req.ip ?? '')
    )
      .toString()
      .split(',')[0]
      .trim();
    const ipHash = rawIp
      ? createHash('sha256').update(rawIp).digest('hex').slice(0, 16)
      : undefined;
    const userAgent =
      (req.headers['user-agent'] ?? '').toString().slice(0, 300) || undefined;

    return this.contact.submit(dto, { ipHash, userAgent });
  }
}
