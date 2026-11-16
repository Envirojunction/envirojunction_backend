import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SocialLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsOptional()
  providerId?: string;
}

