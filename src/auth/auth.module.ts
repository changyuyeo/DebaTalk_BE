import { forwardRef, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'

import { JwtStrategy } from '@auth/jwt/jwt.strategy'
import { AuthService } from '@auth/auth.service'
import { CatsModule } from '@cats/cats.module'

@Module({
	imports: [
		ConfigModule.forRoot(),
		PassportModule.register({ defaultStrategy: 'jwt', session: false }),
		JwtModule.register({
			secret: process.env.JWT_SECRET,
			signOptions: { expiresIn: '1y' }
		}),
		forwardRef(() => CatsModule)
	],
	providers: [AuthService, JwtStrategy],
	exports: [AuthService]
})
export class AuthModule {}
