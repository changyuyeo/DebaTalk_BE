import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'

import { ReadOnlyPostDto } from '@posts/dtos/posts.dto'
import { PostRequestDto } from '@posts/dtos/posts.request.dto'
import { PostsService } from '@posts/posts.service'

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
	@Post()
	async createPost(@Body() body: PostRequestDto) {
		return await this.postsService.createPost(body)
	}

	// @Patch('like')
	// async likerPost() {
	// 	return await this.postsService.
	// }
}
