import * as dotenv from 'dotenv';
import {
  HttpException,
  HttpStatus,
  ValidationPipeOptions,
} from '@nestjs/common';

dotenv.config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new HttpException(
        `validation:error. config error - missing env.${key}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return value;
  }

  getPort(): number {
    return +this.getValue('PORT', false) || 3000;
  }

  getJwtSecret(): string {
    return this.getValue('JWT_SECRET', true);
  }

  getJwtExpiration(): string {
    return this.getValue('JWT_EXP', true);
  }

  getValidationOptions(transform?: true): ValidationPipeOptions {
    const options: ValidationPipeOptions = {
      whitelist: true,
    };

    if (transform) {
      return {
        ...options,
        stopAtFirstError: false,
        transform: true,
        forbidNonWhitelisted: false,
        transformOptions: {
          enableImplicitConversion: true,
          exposeDefaultValues: true,
        },
      };
    }

    return options;
  }

  getMongoDbConfig(): string {
    return this.getValue('MONGO_URL');
  }

  getNotificationTomorrowTimeout(): number {
    return +this.getValue('NOTIFICATION_TOMORROW_TIMEOUT', false) || 60000;
  }

  getNotificationTodayTimeout(): number {
    return +this.getValue('NOTIFICATION_TODAY_TIMEOUT', false) || 60000;
  }
}

const configService = new ConfigService(process.env);

export { configService };
