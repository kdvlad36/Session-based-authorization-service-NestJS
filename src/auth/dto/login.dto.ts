import { IsString } from 'class-validator';

export class LoginDto {
  @IsString()
  idToken: string;

  @IsString()
  device: string;
}
