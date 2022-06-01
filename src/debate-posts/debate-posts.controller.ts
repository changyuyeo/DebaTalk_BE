import {
	Body,
	Controller,
	Get,
	Param,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'

import { DebatePostService } from '@debatePosts/debate-posts.service'
import { CurrentUser } from '@common/decorators/user.decorator'
import { User } from '@users/users.schema'
import {
	DebatePostQueryDto,
	DebatePostRequestDto
} from './dtos/debate-posts.request.dto'
import { JwtAuthGuard } from '@users/jwt/jwt.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '@common/utils/multer.options'

@Controller('debate-posts')
export class DebatePostController {
	constructor(private readonly debatePostService: DebatePostService) {}

	//* 모든 토론게시물 조회 API
	@Get('all')
	async getAllDebatePosts(@Query() query: DebatePostQueryDto) {
		return await this.debatePostService.getAllDebatePosts(query)
	}

	//* 특정 토론게시물 조회 API
	@Get('one/:id')
	async getOneDebatePost(@Param('id') debatePostId: string) {
		return await this.debatePostService.getOneDebatePost(debatePostId)
	}

	//* 토론게시물 생성 API
	@Post('create')
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('image', multerOptions('debate-posts')))
	async createPost(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User,
		@Body() body: any
	) {
		return await this.debatePostService.createDebatePost(user, body, file)
	}

	//* 토론게시물 수정 API

	//* 토론게시물 조회수 갱신 API

	//* 토론게시물 추천 API

	//* 토론게시물 추천 취소 API

	//* 토론게시물 비추천 API

	//* 토론게시물 비추천 취소 API

	//* 토론게시물 삭제 API
}
