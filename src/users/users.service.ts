import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'

import { UserRequestDto } from '@users/dtos/users.request.dto'
import { UsersRepository } from '@users/users.repository'
import { User } from '@users/users.schema'

@Injectable()
export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async signUp(body: UserRequestDto) {
		const { userId, email, nickname, password } = body
		const isUserExist = await Promise.all([
			this.usersRepository.existsUser({ userId }),
			this.usersRepository.existsUser({ email }),
			this.usersRepository.existsUser({ nickname })
		])
		const userValidNumber = isUserExist.indexOf(true)

		if (userValidNumber >= 0) {
			const exostError = (message: string) => {
				throw new UnauthorizedException(
					`해당하는 ${message}는 이미 존재합니다.`
				)
			}
			switch (userValidNumber) {
				case 0:
					exostError('아이디')
				case 1:
					exostError('이메일')
				case 2:
					exostError('닉네임')
			}
		}

		const hashedPassword = await bcrypt.hash(password, 10)
		const newUser = await this.usersRepository.create({
			userId,
			email,
			nickname,
			password: hashedPassword
		})

		return newUser.readOnlyData
	}

	async uploadImg(user: User, file: Express.Multer.File) {
		const fileName = `users/${file.filename}`
		const newUser = await this.usersRepository.findByIdAndUpdateImg(
			user.id,
			'upload',
			fileName
		)
		return newUser
	}

	async getAllUsers() {
		const allUsers = await this.usersRepository.findAllUsers()
		const readOnlyUsers = allUsers.map(user => user.readOnlyData)
		return readOnlyUsers
	}

	async deleteImg(user: User) {
		const newUser = await this.usersRepository.findByIdAndUpdateImg(
			user.id,
			'remove'
		)
		return newUser
	}

	async deleteUser(user: User, targetId: string) {
		const userId = await this.usersRepository.findByIdAndDeleteUser(
			user,
			targetId
		)
		return userId
	}
}
