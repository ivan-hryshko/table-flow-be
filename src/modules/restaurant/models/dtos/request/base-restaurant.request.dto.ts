import { IsNotEmpty } from 'class-validator';

export class BaseRestaurantRequestDto {
  @IsNotEmpty()
  readonly title: string;

  @IsNotEmpty()
  readonly city: string;

  readonly type: string;

  readonly description: string;

  readonly location: string;

  readonly openingTime: string;

  readonly closingTime: string;
}
