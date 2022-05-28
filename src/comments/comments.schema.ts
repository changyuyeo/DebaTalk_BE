import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsPositive, IsString } from 'class-validator'
import * as dayjs from 'dayjs'
import { Document, Types } from 'mongoose'

@Schema()
export class Comment extends Document {
	@ApiProperty({
		example: '6292397951401bd38a778803',
		description: '댓글 작성자 id'
	})
	@Prop({ type: Types.ObjectId, required: true, ref: 'users' })
	@IsNotEmpty()
	author: Types.ObjectId

	@ApiProperty({ description: '댓글 작성 대상 게시물 id' })
	@Prop({ type: Types.ObjectId, required: true, ref: 'posts' })
	@IsNotEmpty()
	info: Types.ObjectId

	@ApiProperty({
		example: '안녕하세요 댓글입니다!',
		description: '댓글 컨텐츠',
		required: true
	})
	@Prop({ required: true })
	@IsNotEmpty()
	@IsString()
	content: string

	@ApiProperty({ example: [], description: '댓글 추천수' })
	@Prop({ default: [] })
	@IsPositive()
	likeList: Array<string>

	@ApiProperty({ example: [], description: '댓글 비추천수' })
	@Prop({ default: [] })
	@IsPositive()
	unlikeList: Array<string>

	@ApiProperty({ example: '2022-04-05', description: '댓글 생성일자' })
	@Prop({ default: dayjs().format('YYYY-MM-DD') })
	createDate: string

	readonly readOnlyData: {
		id: string
		author: string
		content: string
		likeList: Array<string>
		unlikeList: Array<string>
		createDate: string
	}
}

export const CommentSchema = SchemaFactory.createForClass(Comment)

CommentSchema.virtual('readOnlyData').get(function (this: Comment) {
	return {
		id: this.id,
		author: this.author,
		content: this.content,
		likeList: this.likeList,
		unlikeList: this.unlikeList,
		createDate: this.createDate
	}
})
