import mockFirebaseAdmin from './firebase-admin.mock';

jest.mock('firebase-admin', () => ({
  __esModule: true, // это помогает, если у вас есть проблемы с импортами по умолчанию и именованными импортами
  ...mockFirebaseAdmin,
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../src/auth/controllers/auth.controller';
import { AuthService } from '../src/auth/services/auth.service';
import { LoginDto } from '../src/auth/dto/login.dto';
import { Request } from 'express';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  console.log('start test AuthController');

  beforeEach(async () => {
    service = {
      register: jest.fn(),
      verifyIdToken: jest.fn(),
      createSession: jest.fn(),
    } as unknown as AuthService;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should log in a user', async () => {
    const loginDto = new LoginDto();
    loginDto.idToken = 'token';

    const req = {} as Request;

    // Mock the service functions
    (service.verifyIdToken as jest.Mock).mockResolvedValue({ uid: 'testUid' });
    (service.createSession as jest.Mock).mockResolvedValue({
      sessionId: 'testSessionId',
    });

    const result = await controller.login(loginDto, req);
    expect(result).toBeDefined();
    expect(service.verifyIdToken).toHaveBeenCalledWith('token');
    expect(service.createSession).toHaveBeenCalledWith('testUid', req);
  });

  // Add more test cases as needed
});

jest.mock('firebase-admin', () => ({
  __esModule: true, // это помогает, если у вас есть проблемы с импортами по умолчанию и именованными импортами
  ...mockFirebaseAdmin,
}));

import { RegisterDto } from '../src/auth/dto/register.dto';

describe('AuthService', () => {
  let service: AuthService;
  console.log('start test AuthService');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a user', async () => {
    const registerDto = new RegisterDto();
    registerDto.email = 'test@example.com';
    registerDto.password = 'password';

    const user = await service.register(registerDto);
    expect(user.email).toEqual(registerDto.email);
    // Add more expectations based on your service logic
  });

  // Add more test cases as needed
});
