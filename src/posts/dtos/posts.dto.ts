import { ApiProperty, PickType } from '@nestjs/swagger'

import { Post } from '@posts/posts.schema'

export class ReadOnlyPostDto extends PickType(Post, [
	'category',
	'title',
	'content',
	'liker',
	'unliker',
	'hits',
	'imgUrl',
	'createDate'
] as const) {
	@ApiProperty({
		example: '624c480198bd174b28ef930b',
		description: '고유 아이디'
	})
	id: string
}
