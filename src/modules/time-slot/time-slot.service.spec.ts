import { Test, TestingModule } from '@nestjs/testing';
import { TimeSlotService } from './time-slot.service';
import { getModelToken } from '@nestjs/mongoose';
import { modelNames } from '../../constants';
import { model } from 'mongoose';
import { TimeSlotSchema } from './time-slot.model';

describe('TimeSlotService', () => {
  let service: TimeSlotService;
  const TimeSlotModule = model(modelNames.timeSlot, TimeSlotSchema);
  const mockTimeSlotModel = {
    create: jest.fn((dto: any[]) => dto.map((d) => new TimeSlotModule(d))),
    findOne: jest.fn(() => false),
    findById: jest.fn(() => true),
    find: jest.fn(() => true),
    findByIdAndUpdate: jest.fn(() => true),
  };
  const mockUserModel = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TimeSlotService,
        {
          provide: getModelToken(modelNames.timeSlot),
          useValue: mockTimeSlotModel,
        },
        {
          provide: getModelToken(modelNames.user),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<TimeSlotService>(TimeSlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
