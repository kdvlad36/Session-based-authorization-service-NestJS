import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'ID токена пользователя' })
  @IsString()
  idToken: string;

  @ApiProperty({ description: 'Информация об устройстве пользователя' })
  @IsString()
  device: string;
}
