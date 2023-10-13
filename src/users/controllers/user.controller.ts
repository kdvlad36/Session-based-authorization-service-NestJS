import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterDto } from '../dto/register.dto';
import { User } from '../models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto): Promise<User> {
    return this.userService.register(registerDto);
  }
}
