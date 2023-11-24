import { IsNotEmpty } from 'class-validator';

export class UpdateFloorRequestDto {
  @IsNotEmpty()
  readonly id: number;

  readonly title: string;
}
