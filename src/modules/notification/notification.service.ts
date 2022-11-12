import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { configService } from '../../config';
import { InjectModel } from '@nestjs/mongoose';
import { modelNames, NotificationTypes } from '../../constants';
import { Model } from 'mongoose';
import { TimeSlotDocument } from '../time-slot/time-slot.model';
import * as dayjs from 'dayjs';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as os from 'os';
import { ReminderInterface } from './interfaces';

@Injectable()
export class NotificationService {
  private readonly pathToReminders = path.join(
    __dirname,
    '../',
    '../',
    '../',
    'reminders.log',
  );

  constructor(
    @InjectModel(modelNames.timeSlot)
    private readonly _timeSlotModel: Model<TimeSlotDocument>,
  ) {}

  @Interval(configService.getNotificationTomorrowTimeout())
  async sendNotificationTomorrow(): Promise<void> {
    await this.sendNotification(NotificationTypes.TOMORROW);
  }

  @Interval(configService.getNotificationTodayTimeout())
  async sendNotificationToday(): Promise<void> {
    await this.sendNotification(NotificationTypes.TODAY);
  }

  private async sendNotification(type: NotificationTypes): Promise<void> {
    const today = dayjs();
    const timeSlots = await this._timeSlotModel.aggregate([
      {
        $match: {
          $and: [
            {
              date: {
                $gt:
                  type === NotificationTypes.TOMORROW
                    ? today.add(1, 'day').add(-1, 'hour').toDate()
                    : today.toDate(),
                $lt:
                  type === NotificationTypes.TOMORROW
                    ? today.add(1, 'day').add(1, 'hour').toDate()
                    : today.add(2, 'hour').toDate(),
              },
            },
            {
              ...(type === NotificationTypes.TOMORROW
                ? { isNotificationSentTomorrow: false }
                : { isNotificationSentToday: false }),
            },
            { client: { $exists: true } },
          ],
        },
      },
      {
        $lookup: {
          from: modelNames.user,
          localField: 'client',
          foreignField: '_id',
          as: 'client',
        },
      },
      {
        $lookup: {
          from: modelNames.user,
          localField: 'doctor',
          foreignField: '_id',
          as: 'doctor',
        },
      },
      {
        $set: {
          doctor: { $arrayElemAt: ['$doctor', 0] },
        },
      },
      {
        $set: {
          client: { $arrayElemAt: ['$client', 0] },
        },
      },
    ]);

    if (timeSlots && timeSlots.length) {
      const reminders = timeSlots.map((timeSlot) => {
        const reminderData = {
          currentDate: today.toString(),
          clientName: timeSlot.client.name,
          doctorSpec: timeSlot.doctor.spec,
          visitHour: dayjs(timeSlot.date).get('hour'),
          visitMinute: dayjs(timeSlot.date).get('minute'),
        };

        return type === NotificationTypes.TOMORROW
          ? this.getReminderTomorrow(reminderData)
          : this.getReminderToday(reminderData);
      });

      await fs.appendFile(
        this.pathToReminders,
        reminders.join(os.EOL) + os.EOL,
      );
      await this._timeSlotModel.updateMany(
        { _id: { $in: timeSlots.map((timeSlot) => timeSlot._id) } },
        {
          ...(type === NotificationTypes.TOMORROW
            ? { isNotificationSentTomorrow: true }
            : { isNotificationSentToday: true }),
        },
      );
    }
  }

  private getReminderTomorrow({
    currentDate,
    clientName,
    doctorSpec,
    visitHour,
    visitMinute,
  }: ReminderInterface): string {
    return `${currentDate} | Привіт ${clientName}! Нагадуємо що ви записані до ${doctorSpec} завтра о ${visitHour}:${visitMinute}!`;
  }

  private getReminderToday({
    currentDate,
    clientName,
    doctorSpec,
    visitHour,
    visitMinute,
  }: ReminderInterface): string {
    return `${currentDate} | Привіт ${clientName}! Вам через 2 години до ${doctorSpec} о ${visitHour}:${visitMinute}!`;
  }
}
