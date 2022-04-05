import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import * as dayjs from 'dayjs'
import { Document } from 'mongoose'

import { Category } from '@typings/category'

@Schema()
export class Post extends Document {
	@ApiProperty({ example: '자유', description: '게시글 카테고리' })
	@Prop({ default: '자유' })
	@IsString()
	category: Category

	@ApiProperty({
		example: '첫번째 게시글 입니다!',
		description: '게시글의 제목',
		required: true
	})
	@Prop({ required: true })
	@IsNotEmpty()
	@IsString()
	title: string

	@ApiProperty({
		example: '첫번째 게시글의 내용입니다!',
		description: '게시글의 내용',
		required: true
	})
	@Prop({ required: true })
	@IsNotEmpty()
	@IsString()
	content: string

	@ApiProperty({ description: '해당 게시글의 추천수' })
	@Prop({ default: 0 })
	liker: number

	@ApiProperty({ description: '해당 게시글의 비추천수' })
	@Prop({ default: 0 })
	unliker: number

	@ApiProperty({ description: '해당 게시글의 조회수' })
	@Prop({ default: 0 })
	hits: number

	@ApiProperty({ example: 'default', description: '게시글 이미지' })
	@Prop({ default: 'default' })
	imgUrl: string

	@ApiProperty({ example: '2022년 4월 5일', description: '게시글 생성일자' })
	@Prop({ default: dayjs().format('YYYY년 MM월 DD일') })
	createDate: string

	readonly readOnlyData: {
		id: string
		category: Category
		title: string
		content: string
		liker: number
		unliker: number
		hits: number
		imgUrl: string
		createDate: string
	}
}

export const PostSchema = SchemaFactory.createForClass(Post)

PostSchema.virtual('readOnlyData').get(function (this: Post) {
	return {
		id: this.id,
		category: this.category,
		title: this.title,
		content: this.content,
		liker: this.liker,
		unliker: this.unliker,
		hits: this.hits,
		imgUrl: this.imgUrl,
		createDate: this.createDate
	}
})
