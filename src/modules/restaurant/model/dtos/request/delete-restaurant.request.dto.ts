import { IsNotEmpty, Min } from 'class-validator';

export class DeleteRestaurantRequestDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number;
}
