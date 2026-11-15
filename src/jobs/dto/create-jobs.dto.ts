import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJobsDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  value!: string;

  @IsString()
  @IsNotEmpty()
  source_url!: string;
}

export class GetJobsQueryDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  category?: string;

  @IsOptional()
  search?: string;
}
