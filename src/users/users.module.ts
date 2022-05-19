import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { PassportModule } from '@nestjs/passport'
import { MulterModule } from '@nestjs/platform-express'
import { JwtModule } from '@nestjs/jwt'

import { JwtStrategy } from '@users/jwt/jwt.strategy'
import { UsersController } from '@users/users.controller'
import { User, UserSchema } from '@users/users.schema'
import { UsersService } from '@users/users.service'

@Module({
	imports: [
		ConfigModule.forRoot(),
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MulterModule.register({ dest: './upload' }),
		PassportModule.register({ defaultStrategy: 'jwt', session: false }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1y' }
		})
	],
	controllers: [UsersController],
	providers: [UsersService, JwtStrategy],
	exports: [UsersService]
})
export class UsersModule {}
