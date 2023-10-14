// src/types.d.ts
import { Request } from 'express';
import { Session } from '.session.model';

interface RequestWithSession extends Request {
  session?: Session;
}
