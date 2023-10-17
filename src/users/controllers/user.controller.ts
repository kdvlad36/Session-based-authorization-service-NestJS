import { Controller, Get, Query } from '@nestjs/common';
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

  @Get('search')
  @ApiResponse({
    status: 200,
    description:
      'Получение пользователя по заданным критериям (ID, email или дата создания).',
  })
  async getUserByCriteria(
    @Query('uid') uid: string,
    @Query('email') email: string,
    @Query('createdAt') createdAt: string,
  ): Promise<User | null> {
    const criteria = {
      uid,
      email,
      createdAt: createdAt ? new Date(createdAt) : undefined,
    };
    if (!uid && !email && !createdAt) {
      throw new Error('Please provide at least one search criteria.');
    }

    return await this.userService.getUserByCriteria(criteria);
  }
}
