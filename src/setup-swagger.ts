import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import swaggerConfig, { Version, Tag } from './config/swagger'

export function setupSwagger(app: INestApplication): void {
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.desc)
    .setVersion(Version.TEST)
    .addTag(Tag.TEST)
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/api/docs', app, document)
}