import { PickType } from '@nestjs/swagger'

import { Post } from '@posts/posts.schema'

export class PostRequestDto extends PickType(Post, [
	'category',
	'title',
	'content'
] as const) {}
