import { Injectable, UnauthorizedException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'

import { ExistsUserType } from '@typings/users'
import { UserRequestDto } from '@users/dtos/users.request.dto'
import { User } from '@users/users.schema'

@Injectable()
export class UsersRepository {
	constructor(
		@InjectModel(User.name) private readonly userModel: Model<User>
	) {}

	async existsUser(data: ExistsUserType): Promise<boolean> {
		const result = await this.userModel.exists(data)
		return result
	}

	async findAllUsers() {
		const users = await this.userModel.find()
		return users
	}

	async findUserByUserId(userId: string) {
		const user = await this.userModel.findOne({ userId })
		return user
	}

	async findUserByIdWithoutPassword(
		id: string | Types.ObjectId
	): Promise<User | null> {
		const user = await this.userModel.findById(id).select('-password')
		return user
	}

	async findByIdAndUpdateImg(
		id: string,
		type: 'upload' | 'remove',
		fileName?: string
	) {
		const user = await this.userModel.findById(id)
		user.imgUrl =
			type === 'upload'
				? `${process.env.SERVER_URI}/media/${fileName}`
				: 'defalut'
		const newUser = await user.save()
		return newUser.readOnlyData
	}

	async create(user: UserRequestDto): Promise<User> {
		return await this.userModel.create(user)
	}

	async findByIdAndDeleteUser(user: User, id: string) {
		if (user.id === id) {
			const deleteUser = await this.userModel.findByIdAndDelete(id)
			return deleteUser.id
		} else {
			throw new UnauthorizedException('유저정보가 일치하지 않습니다.')
		}
	}
}
