import { IsNotEmpty, Min } from "class-validator";

export class DeleteFloorDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number
}
