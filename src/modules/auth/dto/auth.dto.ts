import { IsNotEmpty, IsPositive } from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsPositive()
  readonly userId: number;

  @IsNotEmpty()
  @IsPositive()
  readonly iat: number;
}
