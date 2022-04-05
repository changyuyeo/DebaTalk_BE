import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { LoginRequestDto } from '@auth/dtos/login.request.dto'
import { UsersRepository } from '@users/users.repository'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private jwtService: JwtService
	) {}

	async jwtLogin(data: LoginRequestDto) {
		const { userId, password } = data
		const loginValidFunc = () => {
			throw new UnauthorizedException('아이디또는 비밀번호를 확인해주세요.')
		}

		//* 1. 해당 user 있는지 확인
		const user = await this.usersRepository.findUserByUserId(userId)
		if (!user) loginValidFunc()

		//* 2. password 일치확인
		const isPasswordValidated: boolean = await bcrypt.compare(
			password,
			user.password
		)
		if (!isPasswordValidated) loginValidFunc()

		//* 3. 토큰 발급
		return { token: this.jwtService.sign({ userId, sub: user.id }) }
	}
}
