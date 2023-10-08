import { IsNotEmpty } from "class-validator";

export class UpdateRestaurantDto {
  @IsNotEmpty()
  readonly id: number

  readonly city: string

  readonly type: string

  readonly title: string

  readonly description: string

  readonly location: string
}