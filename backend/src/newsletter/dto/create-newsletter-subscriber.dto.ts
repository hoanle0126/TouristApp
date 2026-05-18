import { IsEmail, MaxLength } from 'class-validator';

export class CreateNewsletterSubscriberDto {
  @IsEmail()
  @MaxLength(160)
  email: string;
}
