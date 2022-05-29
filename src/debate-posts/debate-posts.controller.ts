import { Controller, Get, Query } from '@nestjs/common'

import { DebatePostService } from '@debatePosts/debate-posts.service'

@Controller('debate-posts')
export class DebatePostController {
	constructor(private readonly debatePostService: DebatePostService) {}

	//* 모든 토론게시물 조회 API
	@Get('all')
	async getAllDebatePosts(@Query() query) {
		return await this.debatePostService
	}
	//* 특정 토론게시물 조회 API

	//* 토론게시물 생성 API

	//* 토론게시물 수정 API

	//* 토론게시물 조회수 갱신 API

	//* 토론게시물 추천 API

	//* 토론게시물 추천 취소 API

	//* 토론게시물 비추천 API

	//* 토론게시물 비추천 취소 API

	//* 토론게시물 삭제 API
}
