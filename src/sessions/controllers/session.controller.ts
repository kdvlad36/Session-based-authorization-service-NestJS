import { Controller, Get, Delete, Req, Param, UseGuards } from '@nestjs/common';
import { SessionService } from '../services/session.service';
import { RequestWithSession } from '../models/session.model';
import { SessionMiddleware } from '../middlewares/session.middleware';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Сессии')
@Controller('sessions')
@UseGuards(SessionMiddleware)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  @ApiResponse({
    status: 200,
    description:
      'Получение активных сессий пользователя, с учетом автоматического и принудительного завершения сессий.',
  })
  async getActiveSessions(@Req() req: RequestWithSession) {
    console.log('getActiveSessions invoked');

    if (!req.session || !req.session.uid) {
      console.error('Session or User ID is undefined');
      return { message: 'No active sessions' };
    }

    const uid = req.session.uid;
    console.log('User ID:', uid);

    const activeSessions = await this.sessionService.getActiveSessions(uid);
    if (activeSessions.length === 0) {
      return { message: 'No active sessions' };
    }

    return activeSessions;
  }

  // New method to force session termination
  @Delete('end/:sessionId')
  @ApiResponse({
    status: 200,
    description: 'Принудительное завершение сессии пользователя по ID сессии.',
  })
  async endSession(@Param('sessionId') sessionId: string) {
    console.log('endSession invoked with sessionId:', sessionId);

    await this.sessionService.endSession(sessionId);
    return { message: 'Session ended successfully' };
  }
}
