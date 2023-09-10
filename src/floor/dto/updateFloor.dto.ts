import { IsNotEmpty } from "class-validator";

export class UpdateFloorDto {
  @IsNotEmpty()
  readonly id: number

  readonly title: string
}