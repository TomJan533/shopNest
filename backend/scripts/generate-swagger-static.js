import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { getAbsoluteFSPath as swaggerUiAssetPath } from 'swagger-ui-dist';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../dist/src/app.module.js';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import fs from 'fs-extra';

async function generateSwagger() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('ShopNest API')
    .setDescription('API documentation for the shopNest application')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // Get the path of the current module
  const __dirname = fileURLToPath(new URL('.', import.meta.url));

  // Write the Swagger JSON file
  writeFileSync(resolve(__dirname, '../docs/swagger.json'), JSON.stringify(document));

  // Copy Swagger-UI assets to the docs folder
  fs.copySync(swaggerUiAssetPath(), resolve(__dirname, '../docs'));

  // Inject custom Swagger JSON URL into the index.html
  const indexHtmlPath = resolve(__dirname, '../docs/index.html');
  const indexHtml = fs.readFileSync(indexHtmlPath, 'utf-8')
    .replace('https://petstore.swagger.io/v2/swagger.json', './swagger.json');
  fs.writeFileSync(indexHtmlPath, indexHtml);

  await app.close();
}

generateSwagger();
