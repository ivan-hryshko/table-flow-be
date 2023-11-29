import { IsNotEmpty, Min } from 'class-validator';

export class DeleteTableRequestDto {
  @IsNotEmpty()
  @Min(0)
  readonly id: number;
}
