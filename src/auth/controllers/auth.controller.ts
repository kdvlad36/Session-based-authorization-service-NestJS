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
import { Request } from 'express'; // импортируем тип Request из express

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) registerDto: RegisterDto) {
    console.log('Register DTO in Controller:', registerDto); // Добавлено логирование DTO в контроллере
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() req: Request) {
    // добавляем параметр req
    try {
      const user = await this.authService.verifyIdToken(loginDto.idToken);
      const session = await this.authService.createSession(user.uid, req); // добавляем await и передаем req
      return { sessionId: session.sessionId }; // отправляем ID сессии на клиент
    } catch (error) {
      console.error('Login error:', error); // добавьте логирование ошибки
      throw new HttpException('Login failed', HttpStatus.BAD_REQUEST);
    }
  }
}
