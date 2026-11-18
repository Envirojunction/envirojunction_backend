import { IsEmail, IsOptional, IsString, MinLength, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrganisationDetailsDto } from '../../users/dto/signup.dto';

export class OrganisationSignUpDto {
  @IsString()
  name!: string; // Company / Organisation Name

  @IsEmail()
  email!: string; // Work email

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsOptional()
  @IsString()
  role?: string;

  // Optional direct organisation details
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  expertise?: string[];

  @IsOptional()
  @IsString()
  companySize?: string;

  @IsOptional()
  @IsString()
  primaryUseCase?: string;

  @IsOptional()
  @IsString()
  website?: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  logo?: string;

  @IsOptional()
  @IsString()
  gstNumber?: string;

  @IsOptional()
  @IsString()
  cinNumber?: string;

  // Also support nested organisationDetails object
  @IsOptional()
  @ValidateNested()
  @Type(() => OrganisationDetailsDto)
  organisationDetails?: OrganisationDetailsDto;
}
