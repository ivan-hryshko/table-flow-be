import { IsNotEmpty } from "class-validator";

export class CreateFloorDto {
  @IsNotEmpty()
  readonly title: string

  @IsNotEmpty()
  readonly restaurantId: number
}