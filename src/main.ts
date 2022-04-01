import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { DocumentBuilder, SwaggerModule, OpenAPIObject } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as basicAuth from 'express-basic-auth'
import * as path from 'path'

import { AppModule } from '@root/app.module'
import { HttpExceptionFilter } from '@common/exceptions/http-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)
	const { ORIGIN, PORT, SWAGGER_USER, SWAGGER_PASSWORD } = process.env

	app.useGlobalPipes(new ValidationPipe({ transform: true }))
	app.useGlobalFilters(new HttpExceptionFilter())
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

	const config = new DocumentBuilder()
		.setTitle('C.I.C')
		.setDescription('cat')
		.setVersion('1.0.0')
		.build()
	const document: OpenAPIObject = SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('api', app, document)

	await app.listen(PORT)
}

bootstrap()
