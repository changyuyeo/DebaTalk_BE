import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import * as dayjs from 'dayjs'
import { Document } from 'mongoose'

@Schema()
export class User extends Document {
	@ApiProperty({
		example: 'jebong8691',
		description: '아이디',
		required: true
	})
	@Prop({ required: true, unique: true })
	@IsString()
	@IsNotEmpty()
	userId: string

	@ApiProperty({
		example: 'jebong@gmail.com',
		description: '이메일',
		required: true
	})
	@Prop({ required: true, unique: true })
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		example: '제봉팍',
		description: '닉네임',
		required: true
	})
	@Prop({ required: true, unique: true })
	@IsString()
	@IsNotEmpty()
	nickname: string

	@ApiProperty({
		example: '12345678',
		description: '비밀번호',
		required: true
	})
	@Prop({ required: true })
	@IsString()
	@IsNotEmpty()
	password: string

	@ApiProperty({ description: '프로필 이미지 URL' })
	@Prop({ default: 'default' })
	imgUrl: string

	@ApiProperty({ example: 1, description: '유저 LV' })
	@Prop({ default: 1 })
	level: number

	@ApiProperty({ example: 0, description: '유저 POINT' })
	@Prop({ default: 0 })
	point: number

	@ApiProperty({ example: 0, description: '관리자 등급' })
	@Prop({ default: 0 })
	manageLevel: number

	@ApiProperty({ example: '2022년 4월 5일', description: '생성일자' })
	@Prop({ default: dayjs().format('YYYY년 MM월 DD일') })
	createDate: string

	readonly readOnlyData: {
		id: string
		userId: string
		email: string
		nickname: string
		imgUrl: string
		level: number
		point: number
		manageLevel: number
		createDate: string
	}
}

export const UserSchema = SchemaFactory.createForClass(User)

UserSchema.virtual('readOnlyData').get(function (this: User) {
	return {
		id: this.id,
		userId: this.userId,
		email: this.email,
		nickname: this.nickname,
		imgUrl: this.imgUrl,
		level: this.level,
		point: this.point,
		manageLevel: this.manageLevel,
		createDate: this.createDate
	}
})
