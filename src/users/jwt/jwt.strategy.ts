import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Model } from 'mongoose'

import { Payload } from '@typings/payload'
import { InjectModel } from '@nestjs/mongoose'
import { User } from '@users/users.schema'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {
		//* jwt 설정
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
			ignoreExpiration: false
		})
	}

	//* 토큰 인증 부분
	async validate(payload: Payload) {
		const user = await this.userModel.findById(payload.sub).select('-password')

		if (user) return user
		else throw new UnauthorizedException('접근 오류')
	}
}
