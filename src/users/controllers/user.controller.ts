import { Controller, Get } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description: 'Получение списка всех пользователей.',
  })
  async getAllUsers(): Promise<User[]> {
    return await this.userService.getAllUsers();
  }
}
