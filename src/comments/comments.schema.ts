import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsString, IsPositive } from 'class-validator'
import { Document, SchemaOptions, Types } from 'mongoose'

const options: SchemaOptions = {
	timestamps: true
}

@Schema(options)
export class Comment extends Document {
	@ApiProperty({
		description: '댓글 작성자',
		required: true
	})
	@Prop({ type: Types.ObjectId, required: true, ref: 'cats' })
	@IsString()
	@IsNotEmpty()
	author: Types.ObjectId

	@ApiProperty({
		description: '작성 대상 (게시물, 정보글)',
		required: true
	})
	@Prop({ type: Types.ObjectId, required: true, ref: 'cats' })
	@IsString()
	@IsNotEmpty()
	info: Types.ObjectId

	@ApiProperty({
		example: '안녕하세요 댓글이야요',
		description: '댓글 내용',
		required: true
	})
	@Prop({ required: true })
	@IsString()
	@IsNotEmpty()
	content: string

	@ApiProperty({ example: 5, description: '좋아요 수' })
	@Prop({ default: 0 })
	@IsPositive()
	likeCount: number
}

export const CommentSchema = SchemaFactory.createForClass(Comment)
