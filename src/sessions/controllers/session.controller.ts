import {
  Controller,
  Get,
  Delete,
  Param,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { ApiResponse, ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Сессии')
@Controller('sessions')
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get('all')
  @ApiOperation({
    summary: 'Получить все сессии пользователя',
    operationId: '1_getAllSessions',
  })
  @ApiQuery({ name: 'uid', required: true, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список всех сессий пользователя.',
  })
  async getAllSessions(@Query('uid') uid: string) {
    console.log('getAllSessions invoked');

    if (!uid) {
      console.error('User ID is undefined');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    console.log('User ID:', uid);

    try {
      const allSessions = await this.sessionService.getAllSessions(uid);
      return allSessions.length > 0
        ? allSessions
        : { message: 'No sessions found' };
    } catch (error) {
      throw new HttpException(
        'Could not fetch sessions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @ApiOperation({
    summary: 'Получить активные сессии',
    operationId: '2_getActiveSessions',
  })
  @ApiQuery({
    name: 'uid',
    required: true,
    description: 'ID пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Возвращает список активных сессий пользователя.',
  })
  async getActiveSessions(@Query('uid') uid: string) {
    console.log('getActiveSessions invoked');

    if (!uid) {
      console.error('User ID is undefined');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    console.log('User ID:', uid);

    try {
      const activeSessions = await this.sessionService.getActiveSessions(uid);
      return activeSessions.length > 0
        ? activeSessions
        : { message: 'No active sessions' };
    } catch (error) {
      throw new HttpException(
        'Could not fetch active sessions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Delete('end/:sessionId')
  @ApiOperation({ summary: 'Принудительно завершить сессию' })
  @ApiQuery({ name: 'uid', required: true, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Сессия успешно завершена.',
  })
  async endSession(
    @Query('uid') uid: string,
    @Param('sessionId') sessionId: string,
  ) {
    console.log('endSession invoked with sessionId:', sessionId);

    if (!uid) {
      console.error('User ID is undefined');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.sessionService.endSession(uid, sessionId);
      return { message: 'Session ended successfully' };
    } catch (error) {
      throw new HttpException(
        'Could not end the session',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('end-all')
  @ApiOperation({
    summary: 'Завершить все сессии пользователя',
    operationId: '4_endAllSessions',
  })
  @ApiQuery({ name: 'uid', required: true, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Все сессии пользователя были успешно завершены.',
  })
  async endAllSessions(@Query('uid') uid: string) {
    console.log('endAllSessions invoked with UID:', uid);

    if (!uid) {
      console.error('User ID is undefined');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.sessionService.endAllSessions(uid);
      return { message: 'All sessions ended successfully for UID: ' + uid };
    } catch (error) {
      throw new HttpException(
        'Could not end all sessions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('all')
  @ApiOperation({
    summary: 'Удалить все сессии пользователя',
    operationId: '5_deleteAllSessions',
  })
  @ApiQuery({ name: 'uid', required: true, description: 'ID пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Все сессии пользователя успешно удалены.',
  })
  async deleteAllSessions(@Query('uid') uid: string) {
    console.log('deleteAllSessions invoked');

    if (!uid) {
      console.error('User ID is undefined');
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    console.log('User ID:', uid);

    try {
      await this.sessionService.deleteAllSessions(uid);
      return { message: 'All sessions deleted successfully' };
    } catch (error) {
      throw new HttpException(
        'Could not delete sessions',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
