import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { CatRequestDto } from '@cats/dto/cats.request.dto'
import { CatsRepository } from './cats.repository'

@Injectable()
export class CatsService {
	constructor(private readonly catsRepository: CatsRepository) {}

	async signUp(body: CatRequestDto) {
		const { email, name, password } = body
		const isCatExist = await this.catsRepository.existsByEamil(email)
		const hashedPassword = await bcrypt.hash(password, 10)

		if (isCatExist)
			throw new UnauthorizedException('해당하는 고양이는 이미 존재합니다.')

		const newCat = await this.catsRepository.create({
			email,
			name,
			password: hashedPassword
		})

		return newCat.readOnlyData
	}
}
