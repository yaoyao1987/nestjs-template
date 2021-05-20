import { join } from 'path';
import { Module } from '@nestjs/common';
import { AuthService } from './common/auth/auth.service';
import { AuthModule } from './common/auth/auth.module';

import appConfig from '@/config/index'

@Module({
  imports: [AuthModule],
  providers: [AuthService]
})
export class AppModule {}
