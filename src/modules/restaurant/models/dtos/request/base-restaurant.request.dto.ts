import { IsNotEmpty } from 'class-validator';

export class BaseRestaurantRequestDto {
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
}
