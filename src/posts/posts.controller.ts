import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UploadedFile,
	UseGuards,
	UseInterceptors
} from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { JwtAuthGuard } from '@auth/jwt/jwt.guard'
import { CurrentUser } from '@common/decorators/user.decorator'
import { ReadOnlyPostDto, ReadOnlyPostIdDto } from '@posts/dtos/posts.dto'
import { PostRequestDto } from '@posts/dtos/posts.request.dto'
import { PostsService } from '@posts/posts.service'
import { ReadOnlyUserIdDto } from '@users/dtos/users.dto'
import { User } from '@users/users.schema'
import { FileInterceptor } from '@nestjs/platform-express'
import { multerOptions } from '@root/common/utils/multer.options'

@Controller('posts')
export class PostsController {
	constructor(private readonly postsService: PostsService) {}

	@ApiOperation({ summary: '모든 게시물 가져오기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: [ReadOnlyPostDto] })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@Get('all')
	async getAllPosts() {
		return await this.postsService.getAllPosts()
	}

	@ApiOperation({ summary: '특정 게시물 가져오기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@Get(':id')
	async getOnePost(@Param('id') postId: string) {
		return await this.postsService.getOnePost(postId)
	}

	@ApiOperation({ summary: '새 게시글 작성', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
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

	@ApiOperation({ summary: '해당 게시글 수정', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostDto })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
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

	@ApiOperation({ summary: '해당 게시글의 추천수 올리기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@ApiResponse({ status: 400, description: 'Bad Request...' })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Patch('like/:postId')
	async addLikeNumber(@CurrentUser() user: User, @Param('postId') id: string) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'addLike')
	}

	@ApiOperation({ summary: '해당 게시글의 추천 취소', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@ApiResponse({ status: 400, description: 'Bad Request...' })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Delete('like/:postId')
	async cancleAddLikeNumber(
		@CurrentUser() user: User,
		@Param('postId') id: string
	) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'cancleLike')
	}

	@ApiOperation({ summary: '해당 게시글의 비추천수 올리기', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@ApiResponse({ status: 400, description: 'Bad Request...' })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Patch('unlike/:postId')
	async addUnlikeNumber(
		@CurrentUser() user: User,
		@Param('postId') id: string
	) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'addUnlike')
	}

	@ApiOperation({ summary: '해당 게시글의 비추천 취소', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyUserIdDto })
	@ApiResponse({ status: 400, description: 'Bad Request...' })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Delete('unlike/:postId')
	async cancleAddUnLikeNumber(
		@CurrentUser() user: User,
		@Param('postId') id: string
	) {
		return this.postsService.UpdateLikeOrUnLike(user, id, 'cancleUnlike')
	}

	@ApiOperation({ summary: '해당 게시글의 삭제', tags: ['posts'] })
	@ApiResponse({ status: 200, description: 'success', type: ReadOnlyPostIdDto })
	@ApiResponse({ status: 400, description: 'Bad Request...' })
	@ApiResponse({ status: 401, description: 'Unauthorized Error...' })
	@ApiResponse({ status: 403, description: '다른유저의 게시물 삭제 시도' })
	@ApiResponse({ status: 500, description: 'Server Error...' })
	@UseGuards(JwtAuthGuard)
	@Delete(':postId')
	async deletePost(@CurrentUser() user: User, @Param('postId') id: string) {
		return this.postsService.deletePost(user, id)
	}
}
