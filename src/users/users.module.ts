import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { MulterModule } from '@nestjs/platform-express'
import { JwtModule } from '@nestjs/jwt'

import { JwtStrategy } from '@users/jwt/jwt.strategy'
import { UsersController } from '@users/users.controller'
import { UsersRepository } from '@users/users.repository'
import { User, UserSchema } from '@users/users.schema'
import { UsersService } from '@users/users.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MulterModule.register({ dest: './upload' }),
		PassportModule.register({ defaultStrategy: 'jwt', session: false }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1y' }
		})
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository, JwtStrategy],
	exports: [UsersService, UsersRepository]
})
export class UsersModule {}
