import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/modules/auth/auth.module';
import { getModelToken } from '@nestjs/mongoose';
import { modelNames, UserRoles } from '../src/constants';
import { UserSchema } from '../src/modules/auth/user.model';
import { model, Types } from 'mongoose';
import { configService } from '../src/config';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  const UserModel = model(modelNames.user, UserSchema);
  const baseMockData = {
    _id: new Types.ObjectId('63700099188873cbe07dae2b'),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  const testUserData = {
    name: 'Test',
    phone: '+380973011034',
  };
  const testDoctorData = {
    ...testUserData,
    role: UserRoles.DOCTOR,
    spec: 'Psychiatrist',
  };
  const baseOutput = {
    _id: expect.any(String),
    createdAt: expect.any(String),
    updatedAt: expect.any(String),
  };
  const mockUserModel = {
    findOne: jest.fn(() => false),
    create: jest.fn((dto) => {
      return new UserModel({
        ...dto,
        ...baseMockData,
      });
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(getModelToken(modelNames.user))
      .useValue(mockUserModel)
      .compile();

    app = moduleFixture.createNestApplication();
    await app
      .useGlobalPipes(new ValidationPipe(configService.getValidationOptions()))
      .init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...testDoctorData,
        password: '12345678aA.',
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({
          ...testDoctorData,
          ...baseOutput,
          timeSlots: expect.any(Array),
        });
      });
  });
});
