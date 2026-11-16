import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class EducationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  start_year?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  end_year?: number;
}

export class CertificationDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  start_year?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  end_year?: number;
}

export class WorkExperienceDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  start_year?: number;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  end_year?: number;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsBoolean()
  isPresent?: boolean;
}

export class ProjectDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  projectType?: string;

  @IsOptional()
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  about?: string;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  professional_skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  services?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationDto)
  education?: EducationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications?: CertificationDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkExperienceDto)
  work_experience?: WorkExperienceDto[];

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sectors?: string[];

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectDto)
  projects?: ProjectDto[];

}