import { IsNotEmpty, Min, IsOptional } from 'class-validator';

export class BaseRestaurantRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  city: string;

  @IsOptional()
  type: string;

  @IsOptional()
  description: string;

  @IsOptional()
  location: string;
}
