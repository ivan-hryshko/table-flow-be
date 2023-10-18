import { IsNotEmpty, Min } from "class-validator";

export class CreateTableDto {
  @IsNotEmpty()
  readonly restaurantId: number

  @IsNotEmpty()
  readonly floorId: number

  readonly title: string

  readonly seatsCount: number
}