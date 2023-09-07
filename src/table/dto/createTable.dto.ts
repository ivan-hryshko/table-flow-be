import { IsNotEmpty, Min } from "class-validator";

export class CreateTableDto {
  @IsNotEmpty()
  readonly restaurantId: number

  readonly title: string

  @Min(0)
  @IsNotEmpty()
  readonly x: number

  @Min(0)
  @IsNotEmpty()
  readonly y: number

  readonly seatsCount: number
}