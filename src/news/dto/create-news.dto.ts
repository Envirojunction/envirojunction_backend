import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsString()
  @IsNotEmpty()
  category!: string;

  @IsString()
  @IsNotEmpty()
  image!: string;
}

export class GetNewsQueryDto {
  @IsOptional()
  page?: number = 1;

  @IsOptional()
  limit?: number = 10;

  @IsOptional()
  category?: string;

  @IsOptional()
  search?: string;
}
