import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotController } from './time-slot.controller';
import { TimeSlotService } from './time-slot.service';
import { CanActivate } from '@nestjs/common';
import { AuthGuard, RoleGuard } from '../auth/guards';

describe('TimeSlotController', () => {
  let controller: TimeSlotController;
  const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };
  const mockTimeSlotService = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TimeSlotController],
      providers: [TimeSlotService],
    })
      .overrideProvider(TimeSlotService)
      .useValue(mockTimeSlotService)
      .overrideGuard(AuthGuard)
      .useValue(mockGuard)
      .overrideGuard(RoleGuard)
      .useValue(mockGuard)
      .compile();

    controller = module.get<TimeSlotController>(TimeSlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
