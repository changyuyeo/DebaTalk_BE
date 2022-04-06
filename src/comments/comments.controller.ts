import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { CommentsCreateDto } from '@comments/dtos/comments.create.dto'
import { CommentsService } from '@comments/comments.service'

@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

	@ApiOperation({
		summary: '모든 게시물에 적힌 댓글 가져오기',
		tags: ['comments']
	})
	@Get()
	async getAllComments() {
		return this.commentsService.getAllComments()
	}

	@ApiOperation({
		summary: '특정 게시물에 적힌 댓글 가져오기',
		tags: ['comments']
	})
	@Get(':postId')
	async getComments(@Param('postId') id: string) {
		return this.commentsService.getComments(id)
	}

	@ApiOperation({
		summary: '특정 게시물에 댓글 남기기',
		tags: ['comments']
	})
	@Post(':postId')
	async createComment(
		@Param('postId') id: string,
		@Body() body: CommentsCreateDto
	) {
		return this.commentsService.createComment(id, body)
	}

	@ApiOperation({
		summary: '해당 댓글의 추천수 올리기',
		tags: ['comments']
	})
	@Patch('like/:commentId')
	async addLikeNumber(@Param('commentId') id: string) {
		return this.commentsService.UpdateLikeOrUnLike(id, 'addLike')
	}

	@ApiOperation({
		summary: '해당 댓글의 추천 취소',
		tags: ['comments']
	})
	@Delete('like/:commentId')
	async cancleAddLikeNumber(@Param('commentId') id: string) {
		return this.commentsService.UpdateLikeOrUnLike(id, 'cancleLike')
	}

	@ApiOperation({
		summary: '해당 댓글의 비추천수 올리기',
		tags: ['comments']
	})
	@Patch('unlike/:commentId')
	async addUnlikeNumber(@Param('commentId') id: string) {
		return this.commentsService.UpdateLikeOrUnLike(id, 'addUnlike')
	}

	@ApiOperation({
		summary: '해당 댓글의 비추천 취소',
		tags: ['comments']
	})
	@Delete('unlike/:commentId')
	async cancleAddUnLikeNumber(@Param('commentId') id: string) {
		return this.commentsService.UpdateLikeOrUnLike(id, 'cancleUnlike')
	}
}
