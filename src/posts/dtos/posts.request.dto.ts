import { ApiProperty, PickType } from '@nestjs/swagger'

import { Post } from '@posts/posts.schema'
import { Category } from '@typings/category'

export class PostRequestDto extends PickType(Post, [
	'category',
	'title',
	'content'
] as const) {}

export class PostQueryDto {
	@ApiProperty({
		example: '12',
		description: '조회 갯수 제한 / 출력 갯수'
	})
	limit: string

	@ApiProperty({
		example: '12',
		description: '출력할 데이터 시작부분 지정'
	})
	skip: string
}

export class PostSearchQueryDto {
	@ApiProperty({
		example: '첫번째 게시물 입니다!',
		description: '검색할 제목'
	})
	title: string

	@ApiProperty({
		example: '첫번째 게시물 입니다!',
		description: '검색할 제목'
	})
	category: Category
}
