import { forwardRef, Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { MulterModule } from '@nestjs/platform-express'

import { AuthModule } from '@auth/auth.module'
import { UsersController } from '@users/users.controller'
import { UsersRepository } from '@users/users.repository'
import { User, UserSchema } from '@users/users.schema'
import { UsersService } from '@users/users.service'

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		MulterModule.register({ dest: './upload' }),
		forwardRef(() => AuthModule) //* 순환 참조 모듈
	],
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
	exports: [UsersService, UsersRepository]
})
export class UsersModule {}
