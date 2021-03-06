import { ApiProperty, PickType } from '@nestjs/swagger'

import { DebatePost } from '@debatePosts/debate-posts.schema'
import { DebateCategory, SortKeyType } from '@typings/post'

export class DebatePostRequestDto extends PickType(DebatePost, [
	'method',
	'category',
	'title',
	'content'
] as const) {}

export class DebatePostQueryDto {
	//* 페이지네이션
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

	//* 정렬
	@ApiProperty({
		example: 'hits',
		description: '정렬할 key 값 (hits, createDate)'
	})
	key: SortKeyType

	//* 검색
	@ApiProperty({
		example: '첫번째 게시물 입니다!',
		description: '검색할 제목'
	})
	title: string

	@ApiProperty({
		example: '자유',
		description: '검색할 카테고리'
	})
	category: DebateCategory
}
