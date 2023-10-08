import { IsNotEmpty } from "class-validator";

export class CreateRestaurantDto {
  @IsNotEmpty()
  readonly title: string

  @IsNotEmpty()
  readonly city: string

  readonly type: string

  readonly description: string

  readonly location: string
}