import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';
import { RegisterDto } from '../dto/register.dto';
import { v4 as uuidv4 } from 'uuid';
import { Session } from '../../sessions/types/session.type';

@Injectable()
export class UserService {
  private users: User[] = [];

  async register(registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    const uid = uuidv4(); // генерация уникального идентификатора пользователя
    const sessions: Session[] = []; // инициализация пустого массива сессий
    const user = new User(uid, email, hashedPassword, sessions);
    this.users.push(user);
    return user;
  }
}
