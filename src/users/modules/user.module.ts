import { Module } from '@nestjs/common';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

@Module({
  imports: [], // импорт других модулей, если это необходимо
  controllers: [UserController], // регистрация контроллера пользователя
  providers: [UserService], // регистрация сервиса пользователя
  exports: [UserService], // экспорт сервиса пользователя, если он будет использоваться в других модулях
})
export class UsersModule {}
