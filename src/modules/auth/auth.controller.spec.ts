import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { CanActivate } from '@nestjs/common';
import { AuthGuard } from './guards';
import { AuthService } from './auth.service';
import { Types } from 'mongoose';
import { UserRoles } from '../../constants';

describe('AuthController', () => {
  let controller: AuthController;
  const testUserData = {
    name: 'Test',
    phone: '+380000000000',
    password: '12345678aA.',
  };
  const testClientData = {
    ...testUserData,
    role: UserRoles.CLIENT,
    spec: 'Psychiatrist',
  };
  const testDoctorData = {
    ...testUserData,
    role: UserRoles.DOCTOR,
    spec: 'Psychiatrist',
  };
  const baseMockData = {
    _id: new Types.ObjectId('63700099188873cbe07dae2b'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const baseOutput = {
    _id: expect.any(Types.ObjectId),
    createdAt: expect.any(Date),
    updatedAt: expect.any(Date),
  };
  const mockAuthGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const mockAuthService = {
    register: jest.fn(({ password, ...rest }) => ({
      ...rest,
      ...baseMockData,
      password: Date.now().toString(),
    })),
    login: jest.fn(({ phone, password }) => ({
      phone,
      password: Date.now().toString(),
      token: Date.now().toString(),
      ...baseMockData,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideGuard(AuthGuard)
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a client', async () => {
    const client = await controller.register(testClientData);

    expect(client).toEqual({
      ...testClientData,
      ...baseOutput,
      password: expect.any(String),
    });
  });

  it('should register a doctor', async () => {
    const doctor = await controller.register(testDoctorData);

    expect(doctor).toEqual({
      ...testDoctorData,
      ...baseOutput,
      password: expect.any(String),
    });
  });
});
