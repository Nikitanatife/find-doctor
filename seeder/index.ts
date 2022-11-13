import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { modelNames, TEST_PASSWORD, UserRoles } from '../src/constants';
import { genSalt, hash } from 'bcryptjs';
import * as dayjs from 'dayjs';
import { UserSchema } from '../src/modules/auth/user.model';
import { TimeSlotSchema } from '../src/modules/time-slot/time-slot.model';

dotenv.config();

async function prefill(): Promise<void> {
  try {
    const mongooseClient = await mongoose.connect(process.env.MONGO_URL);
    const salt = await genSalt(10);
    const password = await hash(TEST_PASSWORD, salt);
    const User = mongooseClient.model(modelNames.user, UserSchema);
    const TimeSlot = mongooseClient.model(modelNames.timeSlot, TimeSlotSchema);
    const doctorsData = [],
      clientsData = [],
      timeSlotsData = [];

    for (let i = 0; i < 5; i++) {
      doctorsData.push({
        name: `Test Doctor ${i}`,
        phone: `+38000000000${i}`,
        password,
        role: UserRoles.DOCTOR,
        spec: `Psychiatrist`,
        timeSlots: [],
      });
      clientsData.push({
        name: `Test Client ${i}`,
        phone: `+38011111111${i}`,
        password,
        role: UserRoles.CLIENT,
      });
    }

    const [insertDoctorsResults, insertClientsResults] = await Promise.all([
      User.create(doctorsData),
      User.create(clientsData),
    ]);

    for (let j = 0; j < 5; j++) {
      timeSlotsData.push({
        doctor: insertDoctorsResults[j]._id,
        client: insertClientsResults[j]._id,
        date: dayjs()
          .add(1 + j, 'days')
          .toDate(),
        isNotificationSentTomorrow: false,
        isNotificationSentToday: false,
      });
    }
    timeSlotsData.push({
      doctor: insertDoctorsResults[0]._id,
      client: insertClientsResults[0]._id,
      date: dayjs().add(1, 'hour').toDate(),
      isNotificationSentTomorrow: false,
      isNotificationSentToday: false,
    });

    const timeSlots = await TimeSlot.create(timeSlotsData);
    const doctorsToUpdate = timeSlots.map((timeSlot) => {
      return User.findByIdAndUpdate(timeSlot.doctor, {
        $push: { timeSlots: timeSlot._id },
      });
    });
    await Promise.all(doctorsToUpdate);

    process.exit(0);
  } catch (error) {
    throw new Error(error.message);
  }
}

prefill();
