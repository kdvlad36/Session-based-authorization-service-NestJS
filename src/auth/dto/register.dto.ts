import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'Адрес электронной почты пользователя' })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;
}
