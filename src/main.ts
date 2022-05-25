import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as basicAuth from 'express-basic-auth'
import * as path from 'path'

import { AppModule } from '@src/app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	const { ORIGIN, PORT, SWAGGER_USER, SWAGGER_PASSWORD } = process.env

	//* swagger setting
	const config = new DocumentBuilder()
		.setTitle('디베이톡 API 문서')
		.setDescription('DebaTalk Forum APIs')
		.setVersion('1.0.2')
		.addTag('users')
		.addTag('posts')
		.addTag('comments')
		.build()
	const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.enableCors({ origin: ORIGIN, credentials: true })
	app.use(
		['/api', '/api-json'],
		basicAuth({
			challenge: true,
			users: { [SWAGGER_USER]: SWAGGER_PASSWORD }
		})
	)
	app.useStaticAssets(path.join(__dirname, './common', 'uploads'), {
		prefix: '/media'
	})

	await app.listen(PORT)
}

bootstrap()
