import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString } from 'class-validator'
import * as dayjs from 'dayjs'
import { Document, Types } from 'mongoose'

import { Comment } from '@comments/comments.schema'
import { Category } from '@typings/category'

@Schema()
export class Post extends Document {
	@ApiProperty({ description: '게시글 작성자 id' })
	@Prop({ type: Types.ObjectId, required: true, ref: 'users' })
	@IsNotEmpty()
	author: Types.ObjectId

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
	@Prop({ default: [] })
	likeList: Array<string>

	@ApiProperty({ description: '해당 게시글의 비추천수' })
	@Prop({ default: [] })
	unlikeList: Array<string>

	@ApiProperty({ description: '해당 게시글의 조회수' })
	@Prop({ default: 0 })
	hits: number

	@ApiProperty({ example: 'default', description: '게시글 이미지' })
	@Prop({ default: 'default' })
	imgUrl: string

	@ApiProperty({ example: '2022년 4월 5일', description: '게시글 생성일자' })
	@Prop({ default: dayjs().format('YYYY년 MM월 DD일') })
	createDate: string

	readonly comments: Comment[]

	readonly readOnlyData: {
		id: string
		author: string
		category: Category
		title: string
		content: string
		likeList: Array<string>
		unlikeList: Array<string>
		hits: number
		imgUrl: string
		createDate: string
		comments: Comment[]
	}
}

const _PostSchema = SchemaFactory.createForClass(Post)

_PostSchema.virtual('readOnlyData').get(function (this: Post) {
	return {
		id: this.id,
		author: this.author,
		category: this.category,
		title: this.title,
		content: this.content,
		likeList: this.likeList,
		unlikeList: this.unlikeList,
		hits: this.hits,
		imgUrl: this.imgUrl,
		createDate: this.createDate,
		comments:
			this.comments && this.comments.map(comment => comment.readOnlyData)
	}
})

_PostSchema.virtual('comments', {
	ref: 'comments',
	localField: '_id',
	foreignField: 'info' //* 외래필드
})

_PostSchema.set('toObject', { virtuals: true })
_PostSchema.set('toJSON', { virtuals: true })

export const PostSchema = _PostSchema
