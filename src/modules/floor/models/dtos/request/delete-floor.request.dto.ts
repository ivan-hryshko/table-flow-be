import { IsNotEmpty, Min } from 'class-validator';

export class DeleteFloorRequestDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number;
}
