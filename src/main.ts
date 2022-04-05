import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as basicAuth from 'express-basic-auth'
import * as path from 'path'

import { AppModule } from '@root/app.module'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	const { ORIGIN, PORT, SWAGGER_USER, SWAGGER_PASSWORD } = process.env
	//* swagger setting
	const config = new DocumentBuilder()
		.setTitle('자칭 전문가들의 거대한 토론장')
		.setDescription('Ja-Jeon-Gur Forum APIs')
		.setVersion('1.0.1')
		.addTag('users')
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
