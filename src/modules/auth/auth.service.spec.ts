import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { modelNames, UserRoles } from '../../constants';
import { Types, model } from 'mongoose';
import { UserSchema } from './user.model';

describe('AuthService', () => {
  let service: AuthService;
  const UserModel = model(modelNames.user, UserSchema);
  const testUserData = {
    name: 'Test',
    phone: '+380000000000',
  };
  const testDoctorData = {
    ...testUserData,
    role: UserRoles.DOCTOR,
    spec: 'Psychiatrist',
    timeSlots: [],
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
  const mockUserModel = {
    create: jest.fn((dto) => {
      return new UserModel({
        ...dto,
        ...baseMockData,
      });
    }),
    findOne: jest.fn(() => false),
    toObject: jest.fn((dto) => dto),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      providers: [
        AuthService,
        {
          provide: getModelToken(modelNames.user),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register doctor', async () => {
    const doctor = await service.register({
      ...testDoctorData,
      password: '12345678aA.',
    });
    console.log('doctor', doctor);

    expect(doctor).toEqual({
      ...testDoctorData,
      ...baseOutput,
    });
  });
});
