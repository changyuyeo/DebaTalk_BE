import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import * as dayjs from 'dayjs'
import { Document, Types } from 'mongoose'

import { Category } from '@typings/category'

@Schema()
export class DebatePost extends Document {
	@ApiProperty({ description: '토론 방식', example: '주제토론' })
	@Prop({ default: '주제토론' })
	@IsNotEmpty()
	method: string

	@ApiProperty({ description: '토론게시글 카테고리', example: '자유' })
	@Prop({ default: '자유' })
	@IsString()
	category: Category

	@ApiProperty({
		description: '토론게시글의 제목',
		example: '첫번째 게시글 입니다!',
		required: true
	})
	@Prop({ required: true })
	@IsNotEmpty()
	@IsString()
	title: string

	@ApiProperty({
		description: '토론게시글의 내용',
		example: '첫번째 게시글의 내용입니다!',
		required: true
	})
	@Prop({ required: true })
	@IsNotEmpty()
	@IsString()
	content: string

	@ApiProperty({ description: '해당 토론게시글의 찬성인원 리스트' })
	@Prop({ default: [] })
	agreementList: Array<string>

	@ApiProperty({ description: '해당 토론게시글의 반대인원 리스트' })
	@Prop({ default: [] })
	oppositionList: Array<string>

	@ApiProperty({ description: '해당 게시글의 조회수' })
	@Prop({ default: 0 })
	hits: number

	@ApiProperty({ example: 'default', description: '토론 게시글 이미지' })
	@Prop({ default: 'default' })
	imgUrl: string

	@ApiProperty({ example: '2022년 4월 5일', description: '게시글 생성일자' })
	@Prop({ default: dayjs().format('YYYY년 MM월 DD일') })
	createDate: string

	// readonly comments: Comment[]

	readonly readOnlyData: {
		id: string
		method: string
		category: Category
		title: string
		content: string
		agreementList: Array<string>
		oppositionList: Array<string>
		hits: number
		imgUrl: string
		createDate: string
		// comments: Comment[]
	}
}

const _DebatePostSchema = SchemaFactory.createForClass(DebatePost)

_DebatePostSchema.virtual('readOnlyData').get(function (this: DebatePost) {
	return {
		id: this.id,
		method: this.method,
		category: this.category,
		title: this.title,
		content: this.content,
		agreementList: this.agreementList,
		oppositionList: this.oppositionList,
		hits: this.hits,
		imgUrl: this.imgUrl,
		createDate: this.createDate
		// comments:
		// 	this.comments && this.comments.map(comment => comment.readOnlyData)
	}
})

// _DebatePostSchema.virtual('comments', {
// 	ref: 'comments',
// 	localField: '_id',
// 	foreignField: 'info' //* 외래필드
// })

// _DebatePostSchema.set('toObject', { virtuals: true })
// _DebatePostSchema.set('toJSON', { virtuals: true })

export const DebatePostSchema = _DebatePostSchema
