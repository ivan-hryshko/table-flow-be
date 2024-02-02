export class BaseUserResponseDto {
  readonly id: number;

  readonly email: string;

  readonly password: string;

  readonly bio: string;

  readonly image: string;

  readonly firstName?: string;

  readonly lastName?: string;

  readonly token: string;
}
