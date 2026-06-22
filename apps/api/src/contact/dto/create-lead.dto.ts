import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateLeadDto {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsEmail()
  @Length(3, 200)
  email!: string;

  @IsString()
  @Length(1, 5000)
  message!: string;

  /**
   * Honeypot. Real users never see or fill this; bots do. If present, the
   * submission is accepted with a success response but silently dropped.
   */
  @IsOptional()
  @IsString()
  company?: string;
}
