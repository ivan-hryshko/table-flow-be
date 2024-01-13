import { IsNotEmpty, IsOptional, Min } from 'class-validator';

export class BaseRestaurantRequestDto {
  @IsNotEmpty()
  @Min(0)
  id: number;

  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  location: string;

  @IsOptional()
  openingTime: string;

  @IsOptional()
  closingTime: string;
}
