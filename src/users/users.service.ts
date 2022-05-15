import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserRequestDto } from '@users/dtos/users.request.dto'
import { LoginRequestDto } from '@users/dtos/login.request.dto'
import { UsersRepository } from '@users/users.repository'
import { User } from '@users/users.schema'

@Injectable()
export class UsersService {
	constructor(
		private readonly usersRepository: UsersRepository,
		private jwtService: JwtService
	) {}

	//* 모든 유저 조회 service
	async getAllUsers() {
		const allUsers = await this.usersRepository.findAllUsers()
		const readOnlyUsers = allUsers.map(user => user.readOnlyData)
		return readOnlyUsers
	}

	//* 회원가입 service
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

	//* 로그인 service
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

	//* 회원탈퇴 service
	async deleteUser(user: User, targetId: string) {
		const userId = await this.usersRepository.findByIdAndDeleteUser(
			user,
			targetId
		)
		return userId
	}

	//* 프로필 사진 업로드 service
	async uploadImg(user: User, file: Express.Multer.File) {
		const fileName = `users/${file.filename}`
		const newUser = await this.usersRepository.findByIdAndUpdateImg(
			user.id,
			'upload',
			fileName
		)
		return newUser
	}

	//* 프로필 사진 삭제 service
	async deleteImg(user: User) {
		const newUser = await this.usersRepository.findByIdAndUpdateImg(
			user.id,
			'remove'
		)
		return newUser
	}
}
