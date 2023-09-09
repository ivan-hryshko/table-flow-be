import { IsNotEmpty, Min } from "class-validator";

export class DeleteRestaurantDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number
}
