import { IsNotEmpty } from "class-validator";

export class CreateFloorDto {
  @IsNotEmpty()
  readonly title: string

  readonly description: string

  readonly location: string
}