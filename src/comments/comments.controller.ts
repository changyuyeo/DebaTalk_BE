import {
	Body,
	Controller,
	Delete,
	Param,
	Patch,
	Post,
	UseGuards
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'

import { JwtAuthGuard } from '@src/users/jwt/jwt.guard'
import { CommentsCreateDto } from '@comments/dtos/comments.create.dto'
import { CommentsService } from '@comments/comments.service'
import { CurrentUser } from '@common/decorators/user.decorator'
import { User } from '@users/users.schema'

@Controller('comments')
export class CommentsController {
	constructor(private readonly commentsService: CommentsService) {}

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
	@UseGuards(JwtAuthGuard)
	@Patch('like/:commentId')
	async addLikeNumber(
		@CurrentUser() user: User,
		@Param('commentId') id: string
	) {
		return this.commentsService.UpdateLikeOrUnLike(user, id, 'addLike')
	}

	@ApiOperation({
		summary: '해당 댓글의 추천 취소',
		tags: ['comments']
	})
	@UseGuards(JwtAuthGuard)
	@Delete('like/:commentId')
	async cancleAddLikeNumber(
		@CurrentUser() user: User,
		@Param('commentId') id: string
	) {
		return this.commentsService.UpdateLikeOrUnLike(user, id, 'cancleLike')
	}

	@ApiOperation({
		summary: '해당 댓글의 비추천수 올리기',
		tags: ['comments']
	})
	@UseGuards(JwtAuthGuard)
	@Patch('unlike/:commentId')
	async addUnlikeNumber(
		@CurrentUser() user: User,
		@Param('commentId') id: string
	) {
		return this.commentsService.UpdateLikeOrUnLike(user, id, 'addUnlike')
	}

	@ApiOperation({
		summary: '해당 댓글의 비추천 취소',
		tags: ['comments']
	})
	@UseGuards(JwtAuthGuard)
	@Delete('unlike/:commentId')
	async cancleAddUnLikeNumber(
		@CurrentUser() user: User,
		@Param('commentId') id: string
	) {
		return this.commentsService.UpdateLikeOrUnLike(user, id, 'cancleUnlike')
	}

	@ApiOperation({ summary: '해당 댓글 삭제', tags: ['comments'] })
	@UseGuards(JwtAuthGuard)
	@Delete(':commentId')
	async deleteComment(
		@CurrentUser() user: User,
		@Param('commentId') id: string
	) {
		return this.commentsService.deleteComment(user, id)
	}
}
