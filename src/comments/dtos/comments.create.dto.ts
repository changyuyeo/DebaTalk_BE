import { PickType } from '@nestjs/swagger'
import { Comment } from '@comments/comments.schema'

export class CommentsCreateDto extends PickType(Comment, [
	'author',
	'content'
] as const) {}
