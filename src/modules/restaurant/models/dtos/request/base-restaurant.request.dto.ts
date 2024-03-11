import { IsNotEmpty, IsOptional, Min } from 'class-validator';

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

  @IsOptional()
  openingTime: string;

  @IsOptional()
  closingTime: string;

  @IsNotEmpty()
  floorTitle: string;
}
