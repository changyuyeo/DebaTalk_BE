import { ApiProperty, PickType } from '@nestjs/swagger'
import { Comment } from '@comments/comments.schema'

export class CommentsDto extends PickType(Comment, [
	'author',
	'content',
	'likeList',
	'unlikeList',
	'createDate'
] as const) {
	@ApiProperty({
		example: '6292397951401bd38a778803',
		description: '고유 아이디'
	})
	id: string
}
