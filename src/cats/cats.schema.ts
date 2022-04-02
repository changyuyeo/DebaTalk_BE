import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'
import { Document, SchemaOptions } from 'mongoose'

import { Comment } from '@comments/comments.schema'

const options: SchemaOptions = {
	timestamps: true
}

@Schema(options)
export class Cat extends Document {
	@ApiProperty({
		example: 'jebong@gmail.com',
		description: 'email',
		required: true
	})
	@Prop({ required: true, unique: true })
	@IsEmail()
	@IsNotEmpty()
	email: string

	@ApiProperty({
		example: '박제봉',
		description: 'name',
		required: true
	})
	@Prop({ required: true })
	@IsString()
	@IsNotEmpty()
	name: string

	@ApiProperty({
		example: '1234',
		description: 'password',
		required: true
	})
	@Prop({ required: true })
	@IsString()
	@IsNotEmpty()
	password: string

	@Prop({
		default: 'https://cdn.landesa.org/wp-content/uploads/default-user-image.png'
	})
	@IsString()
	imgUrl: string

	readonly readOnlyData: {
		id: string
		email: string
		name: string
		imgUrl: string
	}

	readonly comments: Comment[]
}

export const _CatSchema = SchemaFactory.createForClass(Cat)

_CatSchema.virtual('readOnlyData').get(function (this: Cat) {
	return {
		id: this.id,
		email: this.email,
		name: this.name,
		imgUrl: this.imgUrl,
		comments: this.comments
	}
})

_CatSchema.virtual('comments', {
	ref: 'comments',
	localField: '_id',
	foreignField: 'info' //* 외래필드
})

_CatSchema.set('toObject', { virtuals: true })
_CatSchema.set('toJSON', { virtuals: true })

export const CatSchema = _CatSchema
