import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from './../dto/login.dto';
import { Request } from 'express';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован.',
  })
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    console.log('Register DTO in Controller:', registerDto);
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход в систему.',
  })
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    try {
      const user = await this.authService.verifyIdToken(loginDto.idToken);
      const session = await this.authService.createSession(user.uid, req);
      return { sessionId: session.sessionId };
    } catch (error) {
      console.error('Login error:', error);
      throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
    }
  }
}
