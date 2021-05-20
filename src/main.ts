import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { setupSwagger } from './setup-swagger';

// 环境变量
const ENV = process.env.NODE_ENV

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 设置 api 访问前缀
  app.setGlobalPrefix('/api')

  if (['development', 'testing'].includes(ENV)) {
    setupSwagger(app);
  }

  await app.listen(3000);
}
bootstrap();
