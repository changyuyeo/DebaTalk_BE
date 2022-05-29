import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Query,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'

import { JwtAuthGuard } from '@src/users/jwt/jwt.guard'
import { CurrentUser } from '@common/decorators/user.decorator'
import { multerOptions } from '@common/utils/multer.options'
import { ReadOnlyPostDto, ReadOnlyPostIdDto } from '@posts/dtos/posts.dto'
import { PostQueryDto, PostRequestDto } from '@posts/dtos/posts.request.dto'
import { PostsService } from '@posts/posts.service'
import { ReadOnlyUserIdDto } from '@users/dtos/users.dto'
import { User } from '@users/users.schema'

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	//* 모든 게시물 조회 API
	@ApiOperation({ summary: '모든 게시물 가져오기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: [ReadOnlyPostDto] })
	@Get('all')
	async getAllPosts(@Query() query: PostQueryDto) {
		return await this.postsService.getAllPosts(query)
	}

	//* 특정 게시물 조회 API
	@ApiOperation({ summary: '특정 게시물 가져오기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostDto })
	@Get(':id')
	async getOnePost(@Param('id') postId: string) {
		return await this.postsService.getOnePost(postId)
	}

	//* 게시물 생성 API
	@ApiOperation({ summary: '새 게시글 작성', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostDto })
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('image', multerOptions('posts')))
	@Post()
	async createPost(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User,
		@Body() body: PostRequestDto
	) {
		return await this.postsService.createPost(user, body, file)
	}

	//* 게시물 수정 API
	@ApiOperation({ summary: '해당 게시글 수정', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostDto })
	@UseGuards(JwtAuthGuard)
	@UseInterceptors(FileInterceptor('image', multerOptions('posts')))
	@Patch(':postId')
	async updatePost(
		@UploadedFile() file: Express.Multer.File,
		@CurrentUser() user: User,
		@Body() body: PostRequestDto,
		@Param('postId') postId: string
	) {
		return await this.postsService.updatePost(postId, user, body, file)
	}

	//* 게시물 조회수 갱신 API
	@ApiOperation({ summary: '해당 게시글의 조회수 올리기', tags: ['posts'] })
	@UseGuards(JwtAuthGuard)
	@Patch('hits/:postId')
	async incViewCount(@Param('postId') postId: string) {
		return await this.postsService.incViewCount(postId)
	}

	//* 게시물 추천 API
	@ApiOperation({ summary: '해당 게시글의 추천수 올리기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@UseGuards(JwtAuthGuard)
	@Patch('like/:postId')
	async addLikeNumber(@CurrentUser() user: User, @Param('postId') id: string) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'addLike')
	}

	//* 게시물 추천 취소 API
	@ApiOperation({ summary: '해당 게시글의 추천 취소', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@UseGuards(JwtAuthGuard)
	@Delete('like/:postId')
	async cancleAddLikeNumber(
		@CurrentUser() user: User,
		@Param('postId') id: string
	) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'cancleLike')
	}

	//* 게시물 비추천 API
	@ApiOperation({ summary: '해당 게시글의 비추천수 올리기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@UseGuards(JwtAuthGuard)
	@Patch('unlike/:postId')
	async addUnlikeNumber(
		@CurrentUser() user: User,
		@Param('postId') id: string
	) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'addUnlike')
	}

	//* 게시물 비추천 취소 API
	@ApiOperation({ summary: '해당 게시글의 비추천 취소', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@UseGuards(JwtAuthGuard)
	@Delete('unlike/:postId')
	async cancleAddUnLikeNumber(
		@CurrentUser() user: User,
		@Param('postId') id: string
	) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'cancleUnlike')
	}

	//* 게시물 삭제 API
	@ApiOperation({ summary: '해당 게시글의 삭제', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostIdDto })
	@ApiResponse({ status: 403, description: '다른유저의 게시물 삭제 시도' })
	@UseGuards(JwtAuthGuard)
	@Delete(':postId')
	async deletePost(@CurrentUser() user: User, @Param('postId') id: string) {
		return this.postsService.deletePost(user, id)
	}
}
