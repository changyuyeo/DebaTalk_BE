import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

import { Payload } from '@typings/payload'
import { UsersRepository } from '@users/users.repository'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private readonly usersRepository: UsersRepository) {
		//* jwt 설정
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: process.env.JWT_SECRET,
			ignoreExpiration: false
		})
	}

	//* 토큰 인증 부분
	async validate(payload: Payload) {
		const user = await this.usersRepository.findUserByIdWithoutPassword(
			payload.sub
		)

		if (user) return user
		else throw new UnauthorizedException('접근 오류')
	}
}
