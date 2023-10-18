import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Электронная почта пользователя' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'Пароль пользователя' })
  @IsString()
  password: string;
}
