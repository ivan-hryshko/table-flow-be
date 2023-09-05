import { IsNotEmpty } from "class-validator";

export class CreateRestaurantDto {
  @IsNotEmpty()
  readonly title: string

  readonly description: string

  readonly location: string
}