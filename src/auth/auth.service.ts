import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { LoginRequestDto } from '@auth/dto/login.request.dto'
import { CatsRepository } from '@cats/cats.repository'

@Injectable()
export class AuthService {
	constructor(
		private readonly catsRepository: CatsRepository,
		private jwtService: JwtService
	) {}

	async jwtLogIn(data: LoginRequestDto) {
		const { email, password } = data
		const cat = await this.catsRepository.findCatByEmail(email)
		const payload = { email, sub: cat.id }
		const isPasswordValidated: boolean = await bcrypt.compare(
			password,
			cat.password
		)

		if (!cat || !isPasswordValidated)
			throw new UnauthorizedException('이메일과 비밀번호를 확인해주세요!')

		return { token: this.jwtService.sign(payload) }
	}
}
